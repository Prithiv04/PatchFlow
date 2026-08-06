from fastapi import APIRouter, File, UploadFile, status
from app.schemas.upload import VideoUploadResponse
from app.services.upload_service import UploadService

router = APIRouter()

@router.post(
    "/upload",
    response_model=VideoUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a video file",
    description="Uploads a video file (MP4, MOV, AVI, MKV), validates format and size, saves it, and returns metadata."
)
async def upload_video(file: UploadFile = File(...)) -> VideoUploadResponse:
    return await UploadService.process_video_upload(file)
