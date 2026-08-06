import re
from typing import Any, Dict, List, Tuple


def apply_patch_to_transcript(
    segments: List[Dict[str, Any]],
    diffs: List[Dict[str, Any]],
) -> Tuple[List[Dict[str, Any]], str, int]:
    """
    Apply target text replacements to transcript segments.

    Returns:
        - patched_segments: list of modified segment dicts
        - full_text: concatenated full text of patched segments
        - total_replacements: count of target occurrences replaced
    """
    if not diffs or not segments:
        full_text = " ".join(s.get("text", "").strip() for s in segments if s.get("text"))
        return segments, full_text, 0

    # Collect target -> replacement pairs from diffs
    replacements: List[Tuple[str, str]] = []
    for diff in diffs:
        target = diff.get("target")
        repl = diff.get("replacement")
        if target and repl and (target, repl) not in replacements:
            replacements.append((target, repl))

    patched_segments = []
    total_replacements = 0

    for seg in segments:
        seg_text = seg.get("text", "")
        for target, repl in replacements:
            pattern = re.compile(re.escape(target), re.IGNORECASE)
            matches = pattern.findall(seg_text)
            if matches:
                total_replacements += len(matches)
                seg_text = pattern.sub(repl, seg_text)

        patched_seg = dict(seg)
        patched_seg["text"] = seg_text
        patched_segments.append(patched_seg)

    full_text = " ".join(s.get("text", "").strip() for s in patched_segments if s.get("text"))
    return patched_segments, full_text, total_replacements


def apply_patch_to_srt(
    srt_content: str,
    diffs: List[Dict[str, Any]],
) -> str:
    """
    Apply target text replacements to an SRT caption string.
    Preserves index numbers and timestamp lines intact.
    """
    if not srt_content or not diffs:
        return srt_content

    replacements: List[Tuple[str, str]] = []
    for diff in diffs:
        target = diff.get("target")
        repl = diff.get("replacement")
        if target and repl and (target, repl) not in replacements:
            replacements.append((target, repl))

    patched_lines = []
    for line in srt_content.splitlines():
        # Skip timestamp lines (00:00:00,000 --> 00:00:02,500) and index lines (pure digits)
        if "-->" in line or line.strip().isdigit():
            patched_lines.append(line)
        else:
            line_text = line
            for target, repl in replacements:
                pattern = re.compile(re.escape(target), re.IGNORECASE)
                line_text = pattern.sub(repl, line_text)
            patched_lines.append(line_text)

    return "\n".join(patched_lines)
