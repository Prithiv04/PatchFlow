import io
import re
import zipfile
from pathlib import Path

MIME_MAP: dict[str, str] = {
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".mkv": "video/x-matroska",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".json": "application/json",
    ".srt": "text/plain",
    ".txt": "text/plain",
    ".zip": "application/zip",
}


def get_mime_type(filename: str) -> str:
    """Return MIME type for the given filename based on its extension."""
    ext = Path(filename).suffix.lower()
    return MIME_MAP.get(ext, "application/octet-stream")


def safe_download_filename(video_id: str, suffix: str, extension: str) -> str:
    """
    Build a sanitized download filename from video_id, optional suffix, and extension.
    Strips any path traversal or invalid characters from video_id.
    Example: safe_download_filename('abc-123', '_transcript', '.json') -> 'abc-123_transcript.json'
    """
    clean_id = re.sub(r"[^\w\-]", "_", video_id)
    clean_ext = re.sub(r"[^\w\.\-]", "", extension)
    return f"{clean_id}{suffix}{clean_ext}"


def validate_belongs_to_video(file_path: Path, video_id: str) -> bool:
    """
    Verify that the file's stem starts with the expected video_id.
    Prevents cross-video file access.
    """
    return file_path.stem.startswith(video_id)


def build_zip_archive(file_entries: list[tuple[str, Path]]) -> bytes:
    """
    Build an in-memory ZIP archive from a list of (zip_entry_name, disk_path) tuples.
    Returns raw ZIP bytes without writing any temp files to disk.
    """
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for entry_name, disk_path in file_entries:
            if disk_path.exists():
                zf.write(disk_path, arcname=entry_name)
    return buf.getvalue()
