from fastapi import APIRouter, Depends, status
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.export_service import ExportService

router = APIRouter()


@router.get(
    "/{video_id}/download/video",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Download original video file",
    description="Streams the original uploaded video file (MP4, MOV, AVI, or MKV) for the given video ID.",
    tags=["Export"],
)
async def download_video(
    video_id: str,
    db: Session = Depends(get_db),
) -> FileResponse:
    return await ExportService.download_video(db=db, video_id=video_id)


@router.get(
    "/{video_id}/download/transcript",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Download transcript JSON",
    description="Downloads the generated transcript as a JSON file for the given video ID.",
    tags=["Export"],
)
async def download_transcript(
    video_id: str,
    db: Session = Depends(get_db),
) -> FileResponse:
    return await ExportService.download_transcript(db=db, video_id=video_id)


@router.get(
    "/{video_id}/download/captions",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Download SRT caption file",
    description="Downloads the generated SRT caption file for the given video ID.",
    tags=["Export"],
)
async def download_captions(
    video_id: str,
    db: Session = Depends(get_db),
) -> FileResponse:
    return await ExportService.download_captions(db=db, video_id=video_id)


@router.get(
    "/{video_id}/download/audio",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Download extracted WAV audio",
    description="Downloads the extracted WAV audio file for the given video ID.",
    tags=["Export"],
)
async def download_audio(
    video_id: str,
    db: Session = Depends(get_db),
) -> FileResponse:
    return await ExportService.download_audio(db=db, video_id=video_id)


@router.get(
    "/{video_id}/download/thumbnail",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Download video thumbnail",
    description="Downloads the generated JPEG thumbnail image for the given video ID.",
    tags=["Export"],
)
async def download_thumbnail(
    video_id: str,
    db: Session = Depends(get_db),
) -> FileResponse:
    return await ExportService.download_thumbnail(db=db, video_id=video_id)


@router.get(
    "/{video_id}/patches/{patch_id}/download/report",
    response_class=Response,
    status_code=status.HTTP_200_OK,
    summary="Download patch analytics report",
    description=(
        "Exports a structured JSON report for the specified patch, including confidence scores, "
        "diffs, affected assets, and execution metadata."
    ),
    tags=["Export"],
)
async def download_patch_report(
    video_id: str,
    patch_id: str,
    db: Session = Depends(get_db),
) -> Response:
    return await ExportService.download_patch_report(
        db=db, video_id=video_id, patch_id=patch_id
    )


@router.get(
    "/{video_id}/download/package",
    response_class=Response,
    status_code=status.HTTP_200_OK,
    summary="Download complete asset package (ZIP)",
    description=(
        "Assembles all available assets for the given video (video, transcript, captions, audio, thumbnail, "
        "and the latest applied patch report) into a ZIP archive and returns it for download. "
        "The ZIP is assembled entirely in memory without writing temporary files to disk."
    ),
    tags=["Export"],
)
async def download_package(
    video_id: str,
    db: Session = Depends(get_db),
) -> Response:
    return await ExportService.download_package(db=db, video_id=video_id)
