from pathlib import Path
from typing import Any, Dict, List

from app.core.logger import logger


def format_srt_timestamp(seconds: float) -> str:
    """Format seconds (float) into SRT timestamp string format HH:MM:SS,mmm."""
    ms = int(round((seconds - int(seconds)) * 1000))
    total_seconds = int(seconds)
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60

    # Ensure ms fits 3 digits
    if ms >= 1000:
        ms = 999

    return f"{hours:02d}:{minutes:02d}:{secs:02d},{ms:03d}"


def generate_srt_content(segments: List[Dict[str, Any]]) -> str:
    """Generate SRT formatted text from a list of segment dicts containing start, end, and text."""
    srt_blocks = []
    for idx, seg in enumerate(segments, start=1):
        start_ts = format_srt_timestamp(seg.get("start", 0.0))
        end_ts = format_srt_timestamp(seg.get("end", 0.0))
        text = seg.get("text", "").strip()

        block = f"{idx}\n{start_ts} --> {end_ts}\n{text}\n"
        srt_blocks.append(block)

    return "\n".join(srt_blocks)


def export_srt_file(segments: List[Dict[str, Any]], output_path: Path) -> Path:
    """Export segments to an .srt file on disk."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    content = generate_srt_content(segments)
    output_path.write_text(content, encoding="utf-8")
    logger.info("SRT caption exported successfully to '%s'", output_path)
    return output_path
