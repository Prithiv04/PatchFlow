from pathlib import Path
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str = "127.0.0.1"
    port: int = 8000
    allowed_origins: list[str] = ["http://localhost:5173"]
    max_upload_size_mb: int = 500
    upload_dir: str = "uploads"
    ffmpeg_path: str = "ffmpeg"
    ffprobe_path: str = "ffprobe"
    thumbnail_dir: str = "thumbnails"
    thumbnail_time_seconds: float = 5.0
    audio_dir: str = "audio"
    transcript_dir: str = "transcripts"
    caption_dir: str = "captions"
    whisper_model_name: str = "base"
    database_url: str = "sqlite:///./patchflow.db"

    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir)
        if not path.is_absolute():
            # Resolve relative to backend root
            path = Path(__file__).resolve().parents[2] / self.upload_dir
        return path

    @property
    def thumbnail_path(self) -> Path:
        path = Path(self.thumbnail_dir)
        if not path.is_absolute():
            # Resolve relative to backend root
            path = Path(__file__).resolve().parents[2] / self.thumbnail_dir
        return path

    @property
    def audio_path(self) -> Path:
        path = Path(self.audio_dir)
        if not path.is_absolute():
            path = Path(__file__).resolve().parents[2] / self.audio_dir
        return path

    @property
    def transcript_path(self) -> Path:
        path = Path(self.transcript_dir)
        if not path.is_absolute():
            path = Path(__file__).resolve().parents[2] / self.transcript_dir
        return path

    @property
    def caption_path(self) -> Path:
        path = Path(self.caption_dir)
        if not path.is_absolute():
            path = Path(__file__).resolve().parents[2] / self.caption_dir
        return path

settings = Settings()
