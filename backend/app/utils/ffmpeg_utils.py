import json
import subprocess
from pathlib import Path
from typing import Any, Dict

from app.core.config import settings
from app.core.logger import logger


def parse_fps(fps_str: str) -> float:
    """Parse FFprobe r_frame_rate or avg_frame_rate string (e.g. '30/1' or '30000/1001') to float."""
    try:
        if "/" in fps_str:
            num, den = fps_str.split("/")
            num_f, den_f = float(num), float(den)
            return round(num_f / den_f, 2) if den_f != 0 else 0.0
        return round(float(fps_str), 2)
    except Exception:
        return 0.0


def extract_video_metadata(video_path: Path) -> Dict[str, Any]:
    """
    Extract technical video and audio metadata using ffprobe.
    Raises RuntimeError if ffprobe fails or is not found.
    """
    if not video_path.exists():
        raise FileNotFoundError(f"File not found: {video_path}")

    cmd = [
        settings.ffprobe_path,
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        str(video_path)
    ]

    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
    except FileNotFoundError as exc:
        logger.error("FFprobe binary not found at '%s': %s", settings.ffprobe_path, str(exc))
        raise RuntimeError(f"FFprobe executable not found: {settings.ffprobe_path}") from exc
    except subprocess.CalledProcessError as exc:
        logger.error("FFprobe execution failed for '%s': %s", video_path, exc.stderr)
        raise RuntimeError(f"FFprobe execution failed: {exc.stderr or str(exc)}") from exc

    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse FFprobe output for '%s': %s", video_path, str(exc))
        raise RuntimeError("Invalid JSON output from FFprobe") from exc

    format_info = data.get("format", {})
    streams = data.get("streams", [])

    video_stream = next((s for s in streams if s.get("codec_type") == "video"), {})
    audio_stream = next((s for s in streams if s.get("codec_type") == "audio"), {})

    duration = float(format_info.get("duration", video_stream.get("duration", 0.0)))
    width = int(video_stream.get("width", 0))
    height = int(video_stream.get("height", 0))
    fps = parse_fps(video_stream.get("r_frame_rate", video_stream.get("avg_frame_rate", "0/1")))
    video_codec = video_stream.get("codec_name", "unknown")
    audio_codec = audio_stream.get("codec_name")
    audio_channels = int(audio_stream["channels"]) if "channels" in audio_stream else None
    bitrate = int(format_info.get("bit_rate", video_stream.get("bit_rate", 0)))
    file_size = int(format_info.get("size", video_path.stat().st_size if video_path.exists() else 0))
    container = format_info.get("format_name", video_path.suffix.lstrip("."))

    return {
        "duration": duration,
        "width": width,
        "height": height,
        "fps": fps,
        "video_codec": video_codec,
        "audio_codec": audio_codec,
        "audio_channels": audio_channels,
        "bitrate": bitrate,
        "file_size": file_size,
        "container": container
    }


def generate_thumbnail(video_path: Path, output_path: Path, timestamp: float) -> None:
    """
    Generate a JPEG thumbnail snapshot from a video at timestamp seconds using ffmpeg.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        settings.ffmpeg_path,
        "-ss", str(timestamp),
        "-i", str(video_path),
        "-vframes", "1",
        "-y",
        str(output_path)
    ]

    try:
        subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        logger.info("Thumbnail generated successfully at '%s'", output_path)
    except FileNotFoundError as exc:
        logger.error("FFmpeg binary not found at '%s': %s", settings.ffmpeg_path, str(exc))
        raise RuntimeError(f"FFmpeg executable not found: {settings.ffmpeg_path}") from exc
    except subprocess.CalledProcessError as exc:
        logger.error("FFmpeg thumbnail generation failed for '%s': %s", video_path, exc.stderr)
        raise RuntimeError(f"FFmpeg thumbnail generation failed: {exc.stderr or str(exc)}") from exc
