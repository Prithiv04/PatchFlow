import re
from pathlib import Path

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv"}
ALLOWED_MIME_TYPES = {
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/avi",
    "video/mkv",
    "application/octet-stream"  # fallback if extension is valid
}

def sanitize_filename(filename: str | None) -> str:
    """
    Sanitize filename by stripping path traversal, removing invalid characters,
    and trimming whitespace.
    """
    if not filename:
        return "unnamed_video"

    # Extract base filename to prevent path traversal
    name = Path(filename).name
    name = name.strip()

    # Remove invalid characters (keep alphanumeric, dots, dashes, underscores)
    cleaned = re.sub(r"[^\w\.\-]", "_", name)

    # Clean consecutive dots or underscores
    cleaned = re.sub(r"_{2,}", "_", cleaned)
    cleaned = cleaned.strip("._")

    return cleaned or "unnamed_video"

def get_file_extension(filename: str | None) -> str:
    """
    Extract lowercased extension from filename.
    """
    if not filename:
        return ""
    return Path(filename).suffix.lower()

def is_valid_extension(extension: str) -> bool:
    """
    Check if the lowercased extension is allowed.
    """
    return extension in ALLOWED_EXTENSIONS

def is_valid_content_type(content_type: str | None) -> bool:
    """
    Check if the MIME content-type is allowed.
    """
    if not content_type:
        return False
    return content_type.lower() in ALLOWED_MIME_TYPES
