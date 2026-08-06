from typing import List
from pydantic import BaseModel, Field


class TranscriptSegment(BaseModel):
    id: int = Field(..., description="Segment sequence ID")
    start: float = Field(..., description="Start timestamp in seconds")
    end: float = Field(..., description="End timestamp in seconds")
    text: str = Field(..., description="Transcribed text line")


class VideoTranscriptResponse(BaseModel):
    video_id: str = Field(..., description="Unique UUID identifier for the video")
    status: str = Field("completed", description="Transcription status ('completed')")
    language: str = Field("en", description="Detected or configured transcription language")
    full_text: str = Field(..., description="Complete combined transcript text")
    segments: List[TranscriptSegment] = Field(..., description="List of transcript segments with timestamps")
    transcript_file: str = Field(..., description="Relative file path to stored transcript JSON ('transcripts/<uuid>.json')")
    caption_file: str = Field(..., description="Relative file path to stored SRT caption file ('captions/<uuid>.srt')")
    created_at: str = Field(..., description="Timestamp of completion in UTC ISO-8601 format (YYYY-MM-DDTHH:MM:SSZ)")
