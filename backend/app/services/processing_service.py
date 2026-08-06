import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logger import logger
from app.db.models import Video, VideoMetadata
from app.schemas.processing import VideoProcessingResponse
from app.utils.ffmpeg_utils import extract_video_metadata, generate_thumbnail, extract_audio


class ProcessingService:
    @staticmethod
    async def process_video(
        video_id: str,
        db: Optional[Session] = None,
    ) -> VideoProcessingResponse:
        start_time = time.time()
        logger.info("Processing started for video_id='%s'", video_id)

        # 1. Locate uploaded video file
        upload_dir: Path = settings.upload_path
        matching_files = list(upload_dir.glob(f"{video_id}.*")) if upload_dir.exists() else []

        if not matching_files:
            error_msg = f"Video file with ID '{video_id}' not found."
            logger.warning("Processing failed for video_id='%s': %s", video_id, error_msg)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )

        video_path = matching_files[0]

        # 2. Execute FFprobe metadata extraction
        try:
            metadata = extract_video_metadata(video_path)
            logger.info("FFprobe metadata extraction successful for video_id='%s'", video_id)
        except Exception as exc:
            logger.error("FFprobe execution failed for video_id='%s': %s", video_id, str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Video metadata extraction failed: {str(exc)}"
            ) from exc

        # 3. Calculate thumbnail timestamp & generate thumbnail
        duration = metadata.get("duration", 0.0)
        default_seconds = settings.thumbnail_time_seconds
        timestamp = default_seconds if duration >= default_seconds else (duration / 2.0)

        thumbnail_dir: Path = settings.thumbnail_path
        thumbnail_dir.mkdir(parents=True, exist_ok=True)
        thumbnail_filename = f"{video_id}.jpg"
        thumbnail_dest = thumbnail_dir / thumbnail_filename

        try:
            generate_thumbnail(video_path, thumbnail_dest, timestamp)
            logger.info("Thumbnail generation successful for video_id='%s'", video_id)
        except Exception as exc:
            logger.error("Thumbnail generation failed for video_id='%s': %s", video_id, str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Thumbnail generation failed: {str(exc)}"
            ) from exc

        # 4. Extract PCM 16kHz mono WAV audio
        audio_dir: Path = settings.audio_path
        audio_dir.mkdir(parents=True, exist_ok=True)
        audio_filename = f"{video_id}.wav"
        audio_dest = audio_dir / audio_filename

        try:
            extract_audio(video_path, audio_dest)
            logger.info("Audio extraction successful for video_id='%s'", video_id)
        except Exception as exc:
            logger.error("Audio extraction failed for video_id='%s': %s", video_id, str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Audio extraction failed: {str(exc)}"
            ) from exc

        elapsed = round(time.time() - start_time, 3)
        processed_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        relative_thumbnail = f"thumbnails/{thumbnail_filename}"
        relative_audio = f"audio/{audio_filename}"
        resolution_str = f"{metadata['width']}x{metadata['height']}"

        # 5. Persist VideoMetadata and update Video status in DB if session provided
        if db is not None:
            # Upsert VideoMetadata
            meta_record = db.query(VideoMetadata).filter(VideoMetadata.video_id == video_id).first()
            if meta_record:
                meta_record.duration = metadata["duration"]
                meta_record.width = metadata["width"]
                meta_record.height = metadata["height"]
                meta_record.fps = metadata["fps"]
                meta_record.video_codec = metadata["video_codec"]
                meta_record.audio_codec = metadata.get("audio_codec")
                meta_record.audio_channels = metadata.get("audio_channels")
                meta_record.bitrate = metadata["bitrate"]
                meta_record.container = metadata["container"]
                meta_record.thumbnail_path = relative_thumbnail
                meta_record.audio_path = relative_audio
                meta_record.created_at = now_utc
            else:
                meta_record = VideoMetadata(
                    video_id=video_id,
                    duration=metadata["duration"],
                    width=metadata["width"],
                    height=metadata["height"],
                    fps=metadata["fps"],
                    video_codec=metadata["video_codec"],
                    audio_codec=metadata.get("audio_codec"),
                    audio_channels=metadata.get("audio_channels"),
                    bitrate=metadata["bitrate"],
                    container=metadata["container"],
                    thumbnail_path=relative_thumbnail,
                    audio_path=relative_audio,
                    created_at=now_utc,
                )
                db.add(meta_record)

            # Update Video status to "processed"
            video_record = db.query(Video).filter(Video.id == video_id).first()
            if video_record:
                video_record.status = "processed"
                video_record.updated_at = now_utc

            db.commit()
            logger.info("VideoMetadata persisted to DB for video_id='%s'", video_id)

        logger.info(
            "Processing completed for video_id='%s' in %s seconds: thumbnail='%s', audio='%s'",
            video_id,
            elapsed,
            relative_thumbnail,
            relative_audio
        )

        return VideoProcessingResponse(
            video_id=video_id,
            status="processed",
            duration=metadata["duration"],
            width=metadata["width"],
            height=metadata["height"],
            fps=metadata["fps"],
            video_codec=metadata["video_codec"],
            audio_codec=metadata["audio_codec"],
            bitrate=metadata["bitrate"],
            container=metadata["container"],
            thumbnail=relative_thumbnail,
            audio_file=relative_audio,
            resolution=resolution_str,
            codec=metadata["video_codec"],
            processing_timestamp=processed_at,
            processed_at=processed_at
        )

    @staticmethod
    async def get_metadata(
        video_id: str,
        db: Optional[Session] = None,
    ) -> VideoProcessingResponse:
        """Retrieve metadata for an existing video file — re-runs processing."""
        return await ProcessingService.process_video(video_id, db=db)
