from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.upload import VideoUploadResponse
from app.services.upload_service import UploadService

router = APIRouter()

@router.post(
    "/upload",
    response_model=VideoUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a video file",
    description="Uploads a video file (MP4, MOV, AVI, MKV), validates format and size, saves it, persists to DB, and returns metadata."
)
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> VideoUploadResponse:
    return await UploadService.process_video_upload(file, db=db)
