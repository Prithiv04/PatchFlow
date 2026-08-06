import time
from datetime import datetime, timezone
from pathlib import Path
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.logger import logger
from app.schemas.processing import VideoProcessingResponse
from app.utils.ffmpeg_utils import extract_video_metadata, generate_thumbnail, extract_audio


class ProcessingService:
    @staticmethod
    async def process_video(video_id: str) -> VideoProcessingResponse:
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

        # 4. Extract PCM 16kHz mono WAV audio as specified in implementation6.md
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
        relative_thumbnail = f"thumbnails/{thumbnail_filename}"
        relative_audio = f"audio/{audio_filename}"
        resolution_str = f"{metadata['width']}x{metadata['height']}"

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
    async def get_metadata(video_id: str) -> VideoProcessingResponse:
        """Retrieve metadata for an existing video file."""
        return await ProcessingService.process_video(video_id)
