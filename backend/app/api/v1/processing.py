from fastapi import APIRouter, status
from app.schemas.processing import VideoProcessingResponse
from app.services.processing_service import ProcessingService

router = APIRouter()

@router.post(
    "/{video_id}/process",
    response_model=VideoProcessingResponse,
    status_code=status.HTTP_200_OK,
    summary="Process an uploaded video",
    description="Extracts video metadata (FFprobe), generates a thumbnail (FFmpeg), and extracts WAV audio (FFmpeg) for an uploaded video."
)
async def process_video(video_id: str) -> VideoProcessingResponse:
    return await ProcessingService.process_video(video_id)

@router.get(
    "/{video_id}/metadata",
    response_model=VideoProcessingResponse,
    status_code=status.HTTP_200_OK,
    summary="Get video metadata",
    description="Retrieves technical video metadata, thumbnail, and audio file status for an uploaded video by ID."
)
async def get_metadata(video_id: str) -> VideoProcessingResponse:
    return await ProcessingService.get_metadata(video_id)
