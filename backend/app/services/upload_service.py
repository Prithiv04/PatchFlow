import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logger import logger
from app.db.models import Video
from app.db.session import get_db
from app.schemas.upload import VideoUploadResponse
from app.utils.file_utils import (
    sanitize_filename,
    get_file_extension,
    is_valid_extension,
    is_valid_content_type,
    ALLOWED_EXTENSIONS
)

CHUNK_SIZE = 1024 * 1024  # 1 MB buffer

class UploadService:
    @staticmethod
    async def process_video_upload(
        file: UploadFile,
        db: Optional[Session] = None,
    ) -> VideoUploadResponse:
        original_name = file.filename or "unnamed_video"
        sanitized_original = sanitize_filename(original_name)
        extension = get_file_extension(original_name)

        logger.info("Upload started: original_filename='%s', content_type='%s'", original_name, file.content_type)

        # 1. Validate file extension
        if not is_valid_extension(extension):
            error_msg = f"Unsupported file extension '{extension}'. Allowed extensions: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            logger.warning("Validation failed for '%s': %s", original_name, error_msg)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )

        # 2. Validate MIME content type
        if not is_valid_content_type(file.content_type):
            error_msg = f"Unsupported content-type '{file.content_type}'."
            logger.warning("Validation failed for '%s': %s", original_name, error_msg)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )

        # 3. Ensure upload directory exists
        upload_dir: Path = settings.upload_path
        upload_dir.mkdir(parents=True, exist_ok=True)

        # 4. Generate unique video ID and saved filename
        video_id = str(uuid.uuid4())
        saved_filename = f"{video_id}{extension}"
        destination_path = upload_dir / saved_filename

        file_size = 0

        # 5. Stream file contents to disk and enforce size limit
        try:
            with open(destination_path, "wb") as out_file:
                while chunk := await file.read(CHUNK_SIZE):
                    file_size += len(chunk)
                    if file_size > settings.max_upload_size_bytes:
                        out_file.close()
                        if destination_path.exists():
                            destination_path.unlink()
                        error_msg = f"File size exceeds maximum allowed size of {settings.max_upload_size_mb} MB."
                        logger.warning("Upload rejected for video_id='%s': %s", video_id, error_msg)
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail=error_msg
                        )
                    out_file.write(chunk)
        except HTTPException:
            raise
        except Exception as exc:
            if destination_path.exists():
                destination_path.unlink()
            logger.error("Failed to save upload '%s': %s", original_name, str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while saving the uploaded file."
            ) from exc
        finally:
            await file.close()

        # 6. Validate non-empty file
        if file_size == 0:
            if destination_path.exists():
                destination_path.unlink()
            error_msg = "Uploaded file is empty (0 bytes)."
            logger.warning("Upload rejected for video_id='%s': %s", video_id, error_msg)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )

        # 7. Generate UTC ISO-8601 timestamp
        timestamp_utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

        # 8. Persist Video record to database if session provided
        if db is not None:
            video_record = Video(
                id=video_id,
                original_filename=sanitized_original,
                saved_filename=saved_filename,
                content_type=file.content_type or "application/octet-stream",
                file_size=file_size,
                status="uploaded",
                created_at=now_utc,
                updated_at=now_utc,
            )
            db.add(video_record)
            db.commit()
            logger.info("Video record persisted to DB for video_id='%s'", video_id)

        logger.info(
            "Upload completed: video_id='%s', saved_filename='%s', size=%d bytes",
            video_id,
            saved_filename,
            file_size
        )

        return VideoUploadResponse(
            video_id=video_id,
            original_filename=sanitized_original,
            saved_filename=saved_filename,
            content_type=file.content_type or "application/octet-stream",
            file_size=file_size,
            upload_timestamp=timestamp_utc
        )
