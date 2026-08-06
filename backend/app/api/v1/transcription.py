from fastapi import APIRouter, Depends, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.transcription import VideoTranscriptResponse
from app.services.transcription_service import TranscriptionService

router = APIRouter()

@router.post(
    "/{video_id}/transcribe",
    response_model=VideoTranscriptResponse,
    status_code=status.HTTP_200_OK,
    summary="Transcribe video audio",
    description="Extracts audio and transcribes it using Whisper, returning structured transcript segments and saving SRT captions."
)
async def transcribe_video(
    video_id: str,
    db: Session = Depends(get_db),
) -> VideoTranscriptResponse:
    return await TranscriptionService.transcribe_video(video_id, db=db)

@router.get(
    "/{video_id}/transcript",
    response_model=VideoTranscriptResponse,
    status_code=status.HTTP_200_OK,
    summary="Get video transcript",
    description="Retrieves the structured transcript and word/segment timestamps for a video."
)
async def get_transcript(
    video_id: str,
    db: Session = Depends(get_db),
) -> VideoTranscriptResponse:
    return await TranscriptionService.get_transcript(video_id, db=db)

@router.get(
    "/{video_id}/captions",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get video captions (.srt)",
    description="Downloads or views the SRT caption file for a video."
)
async def get_captions(video_id: str) -> FileResponse:
    return await TranscriptionService.get_captions(video_id)
