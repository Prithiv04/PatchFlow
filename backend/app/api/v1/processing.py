from fastapi import APIRouter, status
from app.schemas.processing import VideoProcessingResponse
from app.services.processing_service import ProcessingService

router = APIRouter()

@router.post(
    "/{video_id}/process",
    response_model=VideoProcessingResponse,
    status_code=status.HTTP_200_OK,
    summary="Process an uploaded video",
    description="Extracts video metadata (FFprobe) and generates a thumbnail (FFmpeg) for an uploaded video by ID."
)
async def process_video(video_id: str) -> VideoProcessingResponse:
    return await ProcessingService.process_video(video_id)
