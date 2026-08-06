from typing import Optional
from pydantic import BaseModel, Field


class VideoProcessingResponse(BaseModel):
    video_id: str = Field(..., description="Unique UUID identifier for the video")
    status: str = Field("processed", description="Processing status ('processed')")
    duration: float = Field(..., description="Video duration in seconds")
    width: int = Field(..., description="Video width in pixels")
    height: int = Field(..., description="Video height in pixels")
    fps: float = Field(..., description="Video frames per second")
    video_codec: str = Field(..., description="Video codec name (e.g. h264)")
    audio_codec: Optional[str] = Field(None, description="Audio codec name (e.g. aac) if present")
    bitrate: int = Field(..., description="Overall bitrate in bits per second")
    container: str = Field(..., description="Format container name(s)")
    thumbnail: str = Field(..., description="Relative file path to generated thumbnail image")
    audio_file: Optional[str] = Field(None, description="Relative path to extracted WAV audio file ('audio/<uuid>.wav')")
    resolution: Optional[str] = Field(None, description="Resolution formatted string (e.g. '1920x1080')")
    codec: Optional[str] = Field(None, description="Primary codec name")
    processing_timestamp: Optional[str] = Field(None, description="Timestamp of completion in UTC ISO-8601 format")
    processed_at: Optional[str] = Field(None, description="Timestamp of completion in UTC ISO-8601 format")
