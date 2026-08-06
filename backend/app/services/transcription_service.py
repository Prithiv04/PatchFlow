import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logger import logger
from app.db.models import Transcript, Video
from app.schemas.transcription import VideoTranscriptResponse, TranscriptSegment
from app.services.processing_service import ProcessingService
from app.utils.ffmpeg_utils import extract_audio
from app.utils.caption_utils import export_srt_file
from app.utils.whisper_utils import transcribe_audio_file


class TranscriptionService:
    @staticmethod
    async def transcribe_video(
        video_id: str,
        db: Optional[Session] = None,
    ) -> VideoTranscriptResponse:
        logger.info("Transcription requested for video_id='%s'", video_id)

        audio_dir: Path = settings.audio_path
        audio_file = audio_dir / f"{video_id}.wav"

        # If audio file missing, try finding uploaded video and extracting audio
        if not audio_file.exists():
            upload_dir: Path = settings.upload_path
            matching_files = list(upload_dir.glob(f"{video_id}.*")) if upload_dir.exists() else []

            if not matching_files:
                error_msg = f"Video file with ID '{video_id}' not found."
                logger.warning("Transcription failed for video_id='%s': %s", video_id, error_msg)
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=error_msg
                )

            video_path = matching_files[0]
            try:
                extract_audio(video_path, audio_file)
            except Exception as exc:
                logger.error("Audio extraction prior to transcription failed for video_id='%s': %s", video_id, str(exc))
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Audio extraction failed: {str(exc)}"
                ) from exc

        # Execute transcription
        try:
            result = transcribe_audio_file(audio_file, settings.whisper_model_name)
        except Exception as exc:
            logger.error("Transcription failed for video_id='%s': %s", video_id, str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Transcription execution failed: {str(exc)}"
            ) from exc

        created_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

        # Save JSON transcript
        transcript_dir: Path = settings.transcript_path
        transcript_dir.mkdir(parents=True, exist_ok=True)
        transcript_path = transcript_dir / f"{video_id}.json"

        response_payload = {
            "video_id": video_id,
            "status": "completed",
            "language": result["language"],
            "full_text": result["full_text"],
            "segments": result["segments"],
            "transcript_file": f"transcripts/{video_id}.json",
            "caption_file": f"captions/{video_id}.srt",
            "created_at": created_at
        }

        transcript_path.write_text(json.dumps(response_payload, indent=2), encoding="utf-8")

        # Save SRT caption file
        caption_dir: Path = settings.caption_path
        caption_path = caption_dir / f"{video_id}.srt"
        export_srt_file(result["segments"], caption_path)

        # Persist Transcript record to DB if session provided
        if db is not None:
            # Upsert Transcript
            existing = db.query(Transcript).filter(Transcript.video_id == video_id).first()
            if existing:
                existing.language = result["language"]
                existing.full_text = result["full_text"]
                existing.segments_json = json.dumps(result["segments"])
                existing.transcript_path = f"transcripts/{video_id}.json"
                existing.caption_path = f"captions/{video_id}.srt"
                existing.created_at = now_utc
            else:
                transcript_record = Transcript(
                    video_id=video_id,
                    language=result["language"],
                    full_text=result["full_text"],
                    segments_json=json.dumps(result["segments"]),
                    transcript_path=f"transcripts/{video_id}.json",
                    caption_path=f"captions/{video_id}.srt",
                    created_at=now_utc,
                )
                db.add(transcript_record)

            # Update Video status to "transcribed"
            video_record = db.query(Video).filter(Video.id == video_id).first()
            if video_record:
                video_record.status = "transcribed"
                video_record.updated_at = now_utc

            db.commit()
            logger.info("Transcript record persisted to DB for video_id='%s'", video_id)

        logger.info("Transcription completed successfully for video_id='%s'", video_id)

        return VideoTranscriptResponse(
            video_id=video_id,
            status="completed",
            language=result["language"],
            full_text=result["full_text"],
            segments=[TranscriptSegment(**s) for s in result["segments"]],
            transcript_file=f"transcripts/{video_id}.json",
            caption_file=f"captions/{video_id}.srt",
            created_at=created_at
        )

    @staticmethod
    async def get_transcript(
        video_id: str,
        db: Optional[Session] = None,
    ) -> VideoTranscriptResponse:
        transcript_file = settings.transcript_path / f"{video_id}.json"
        if not transcript_file.exists():
            return await TranscriptionService.transcribe_video(video_id, db=db)

        try:
            data = json.loads(transcript_file.read_text(encoding="utf-8"))
            return VideoTranscriptResponse(**data)
        except Exception as exc:
            logger.error("Failed to read transcript for video_id='%s': %s", video_id, str(exc))
            return await TranscriptionService.transcribe_video(video_id, db=db)

    @staticmethod
    async def get_captions(video_id: str) -> FileResponse:
        caption_file = settings.caption_path / f"{video_id}.srt"
        if not caption_file.exists():
            await TranscriptionService.transcribe_video(video_id)

        if not caption_file.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Caption file for video ID '{video_id}' not found."
            )

        return FileResponse(
            path=str(caption_file),
            media_type="application/x-subrip",
            filename=f"{video_id}.srt"
        )
