from pydantic import BaseModel, Field

class VideoUploadResponse(BaseModel):
    video_id: str = Field(..., description="Unique UUID identifier for the uploaded video")
    original_filename: str = Field(..., description="Sanitized original filename")
    saved_filename: str = Field(..., description="Filename as stored on disk (<uuid>.<ext>)")
    content_type: str = Field(..., description="MIME type of the uploaded video")
    file_size: int = Field(..., description="Size of the uploaded file in bytes")
    upload_timestamp: str = Field(..., description="Upload timestamp in UTC ISO-8601 format (YYYY-MM-DDTHH:MM:SSZ)")
