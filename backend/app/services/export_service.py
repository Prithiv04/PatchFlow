from pathlib import Path
from typing import Optional
import io
import json
import zipfile

from fastapi import HTTPException, status
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logger import logger
from app.db.models import Patch, Transcript, Video
from app.utils.export_utils import (
    build_zip_archive,
    get_mime_type,
    safe_download_filename,
    validate_belongs_to_video,
)


class ExportService:

    @staticmethod
    def _validate_video(db: Session, video_id: str) -> Video:
        video: Optional[Video] = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video with ID '{video_id}' not found.",
            )
        return video

    @staticmethod
    def _resolve_file(path: Path, description: str) -> Path:
        if not path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{description} not found on disk.",
            )
        return path

    @staticmethod
    async def download_video(db: Session, video_id: str) -> FileResponse:
        video = ExportService._validate_video(db, video_id)

        # Locate by saved_filename from DB
        file_path = settings.upload_path / video.saved_filename
        ExportService._resolve_file(file_path, "Video file")

        if not validate_belongs_to_video(file_path, video_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied.",
            )

        mime = get_mime_type(video.saved_filename)
        download_name = safe_download_filename(video_id, "", Path(video.saved_filename).suffix)
        logger.info("Video download requested for video_id='%s'", video_id)

        return FileResponse(
            path=str(file_path),
            media_type=mime,
            filename=download_name,
        )

    @staticmethod
    async def download_transcript(db: Session, video_id: str) -> FileResponse:
        ExportService._validate_video(db, video_id)

        file_path = settings.transcript_path / f"{video_id}.json"
        ExportService._resolve_file(file_path, "Transcript file")

        download_name = safe_download_filename(video_id, "_transcript", ".json")
        logger.info("Transcript download requested for video_id='%s'", video_id)

        return FileResponse(
            path=str(file_path),
            media_type="application/json",
            filename=download_name,
        )

    @staticmethod
    async def download_captions(db: Session, video_id: str) -> FileResponse:
        ExportService._validate_video(db, video_id)

        file_path = settings.caption_path / f"{video_id}.srt"
        ExportService._resolve_file(file_path, "Caption file")

        download_name = safe_download_filename(video_id, "_captions", ".srt")
        logger.info("Captions download requested for video_id='%s'", video_id)

        return FileResponse(
            path=str(file_path),
            media_type="text/plain",
            filename=download_name,
        )

    @staticmethod
    async def download_audio(db: Session, video_id: str) -> FileResponse:
        ExportService._validate_video(db, video_id)

        file_path = settings.audio_path / f"{video_id}.wav"
        ExportService._resolve_file(file_path, "Audio file")

        download_name = safe_download_filename(video_id, "_audio", ".wav")
        logger.info("Audio download requested for video_id='%s'", video_id)

        return FileResponse(
            path=str(file_path),
            media_type="audio/wav",
            filename=download_name,
        )

    @staticmethod
    async def download_thumbnail(db: Session, video_id: str) -> FileResponse:
        ExportService._validate_video(db, video_id)

        file_path = settings.thumbnail_path / f"{video_id}.jpg"
        ExportService._resolve_file(file_path, "Thumbnail file")

        download_name = safe_download_filename(video_id, "_thumbnail", ".jpg")
        logger.info("Thumbnail download requested for video_id='%s'", video_id)

        return FileResponse(
            path=str(file_path),
            media_type="image/jpeg",
            filename=download_name,
        )

    @staticmethod
    async def download_patch_report(db: Session, video_id: str, patch_id: str) -> Response:
        ExportService._validate_video(db, video_id)

        patch: Optional[Patch] = (
            db.query(Patch).filter(Patch.id == patch_id, Patch.video_id == video_id).first()
        )
        if not patch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patch with ID '{patch_id}' not found for video '{video_id}'.",
            )

        from datetime import datetime, timezone
        export_timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        report = {
            "video_id": video_id,
            "patch_id": patch_id,
            "version": patch.version or "v1.1",
            "prompt": patch.prompt,
            "status": patch.status,
            "occurrences_changed": patch.occurrences_count,
            "confidence_score": patch.confidence_score,
            "assets_updated": json.loads(patch.affected_assets_json or "[]"),
            "diffs": json.loads(patch.diffs_json or "[]"),
            "warnings": json.loads(patch.warnings_json or "[]"),
            "applied_at": patch.applied_at.strftime("%Y-%m-%dT%H:%M:%SZ") if patch.applied_at else None,
            "export_timestamp": export_timestamp,
        }

        report_bytes = json.dumps(report, indent=2).encode("utf-8")
        download_name = f"report_{patch_id}.json"

        logger.info(
            "Patch report download requested for video_id='%s', patch_id='%s'",
            video_id,
            patch_id,
        )

        return Response(
            content=report_bytes,
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
        )

    @staticmethod
    async def download_package(db: Session, video_id: str) -> Response:
        video = ExportService._validate_video(db, video_id)

        assets_included: list[str] = []
        file_entries: list[tuple[str, Path]] = []

        # Collect available assets
        video_file = settings.upload_path / video.saved_filename
        if video_file.exists():
            ext = Path(video.saved_filename).suffix
            file_entries.append((f"{video_id}{ext}", video_file))
            assets_included.append("video")

        transcript_file = settings.transcript_path / f"{video_id}.json"
        if transcript_file.exists():
            file_entries.append((f"{video_id}_transcript.json", transcript_file))
            assets_included.append("transcript")

        caption_file = settings.caption_path / f"{video_id}.srt"
        if caption_file.exists():
            file_entries.append((f"{video_id}_captions.srt", caption_file))
            assets_included.append("captions")

        audio_file = settings.audio_path / f"{video_id}.wav"
        if audio_file.exists():
            file_entries.append((f"{video_id}_audio.wav", audio_file))
            assets_included.append("audio")

        thumbnail_file = settings.thumbnail_path / f"{video_id}.jpg"
        if thumbnail_file.exists():
            file_entries.append((f"{video_id}_thumbnail.jpg", thumbnail_file))
            assets_included.append("thumbnail")

        # Include the most recent applied patch report if any
        latest_patch: Optional[Patch] = (
            db.query(Patch)
            .filter(Patch.video_id == video_id, Patch.status == "applied")
            .order_by(Patch.applied_at.desc())
            .first()
        )
        if latest_patch:
            from datetime import datetime, timezone
            report_data = {
                "video_id": video_id,
                "patch_id": latest_patch.id,
                "version": latest_patch.version or "v1.1",
                "prompt": latest_patch.prompt,
                "status": latest_patch.status,
                "occurrences_changed": latest_patch.occurrences_count,
                "confidence_score": latest_patch.confidence_score,
                "assets_updated": json.loads(latest_patch.affected_assets_json or "[]"),
                "diffs": json.loads(latest_patch.diffs_json or "[]"),
                "warnings": json.loads(latest_patch.warnings_json or "[]"),
                "applied_at": latest_patch.applied_at.strftime("%Y-%m-%dT%H:%M:%SZ") if latest_patch.applied_at else None,
                "export_timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            }
            assets_included.append("patch_report")

        if not file_entries and latest_patch is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No downloadable assets found for video '{video_id}'.",
            )

        try:
            zip_bytes = build_zip_archive(file_entries)
            # Append patch report as in-memory JSON entry if available
            if latest_patch:
                buf = io.BytesIO(zip_bytes)
                with zipfile.ZipFile(buf, mode="a", compression=zipfile.ZIP_DEFLATED) as zf:
                    zf.writestr(
                        f"report_{latest_patch.id}.json",
                        json.dumps(report_data, indent=2),
                    )
                zip_bytes = buf.getvalue()
        except Exception as exc:
            logger.error("ZIP assembly failed for video_id='%s': %s", video_id, str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate ZIP package.",
            ) from exc

        download_name = f"{video_id}_package.zip"
        logger.info(
            "Package download completed for video_id='%s': %d assets, %d bytes",
            video_id,
            len(assets_included),
            len(zip_bytes),
        )

        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
        )
