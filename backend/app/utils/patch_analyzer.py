import re
from typing import Any, Dict, List


def parse_prompt(prompt: str):
    """
    Parse a declarative patch prompt to extract (target, replacement) pairs.

    Supports patterns such as:
      - "Replace X with Y"
      - "Replace every occurrence of X with Y"
      - "Change X to Y"
      - "Update X to Y"
    Returns a list of dicts: [{"target": str, "replacement": str}]
    """
    patterns = [
        r'replace(?:\s+every(?:\s+occurrence\s+of)?)?\s+"([^"]+)"\s+with\s+"([^"]+)"',
        r"replace(?:\s+every(?:\s+occurrence\s+of)?)?\s+'([^']+)'\s+with\s+'([^']+)'",
        r"replace(?:\s+every(?:\s+occurrence\s+of)?)?\s+([A-Za-z0-9\-\.]+)\s+with\s+([A-Za-z0-9\-\.]+)",
        r'change\s+"([^"]+)"\s+to\s+"([^"]+)"',
        r"change\s+'([^']+)'\s+to\s+'([^']+)'",
        r"change\s+([A-Za-z0-9\-\.]+)\s+to\s+([A-Za-z0-9\-\.]+)",
        r'update\s+"([^"]+)"\s+to\s+"([^"]+)"',
        r"update\s+'([^']+)'\s+to\s+'([^']+)'",
        r"update\s+([A-Za-z0-9\-\.]+)\s+to\s+([A-Za-z0-9\-\.]+)",
    ]

    pairs = []
    prompt_lower = prompt.strip()

    for pattern in patterns:
        for match in re.finditer(pattern, prompt_lower, re.IGNORECASE):
            target = match.group(1).strip()
            replacement = match.group(2).strip()
            # Avoid duplicates
            if not any(p["target"].lower() == target.lower() for p in pairs):
                pairs.append({"target": target, "replacement": replacement})

    return pairs


def analyze_text_asset(
    text: str,
    target: str,
    replacement: str,
    asset_type: str,
    segment_id: int = 0,
    start: float = 0.0,
    end: float = 0.0,
) -> List[Dict[str, Any]]:
    """Scan a text block for occurrences of target and return diff records."""
    diffs = []
    if not text or not target:
        return diffs

    # Case-insensitive count
    pattern = re.compile(re.escape(target), re.IGNORECASE)
    if pattern.search(text):
        patched_text = pattern.sub(replacement, text)
        diffs.append({
            "asset_type": asset_type,
            "segment_id": segment_id,
            "start": start,
            "end": end,
            "original": text.strip(),
            "patched": patched_text.strip(),
            "target": target,
            "replacement": replacement,
        })
    return diffs


def analyze_transcript(
    segments: List[Dict[str, Any]],
    target: str,
    replacement: str,
) -> List[Dict[str, Any]]:
    """Run patch analysis over all transcript segments."""
    all_diffs = []
    for seg in segments:
        seg_diffs = analyze_text_asset(
            text=seg.get("text", ""),
            target=target,
            replacement=replacement,
            asset_type="transcript",
            segment_id=seg.get("id", 0),
            start=seg.get("start", 0.0),
            end=seg.get("end", 0.0),
        )
        all_diffs.extend(seg_diffs)
    return all_diffs


def run_patch_analysis(
    prompt: str,
    full_text: str,
    segments: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Run full patch analysis against transcript data.
    Returns diffs, occurrences, affected_assets, confidence_score, and warnings.
    """
    pairs = parse_prompt(prompt)
    if not pairs:
        return {
            "diffs": [],
            "occurrences_count": 0,
            "affected_assets": [],
            "confidence_score": 0.0,
            "warnings": [
                "Could not parse patch command. Use formats like: "
                "'Replace X with Y' or 'Change X to Y'."
            ],
        }

    all_diffs: List[Dict[str, Any]] = []
    affected_asset_types: set = set()

    for pair in pairs:
        target = pair["target"]
        replacement = pair["replacement"]

        # Analyze per-segment diffs
        seg_diffs = analyze_transcript(segments, target, replacement)
        all_diffs.extend(seg_diffs)

        if seg_diffs:
            affected_asset_types.add("transcript")
            affected_asset_types.add("captions")

    occurrences_count = len(all_diffs)
    affected_assets = sorted(affected_asset_types)

    # Calculate confidence based on parse success and match rate
    if occurrences_count > 0:
        confidence_score = min(1.0, round(0.6 + (0.04 * min(occurrences_count, 10)), 2))
    else:
        confidence_score = 0.0

    warnings = []
    if occurrences_count > 0:
        warnings.append(
            "This patch modifies text elements only. Audio and video tracks remain unchanged."
        )
    if occurrences_count == 0:
        warnings.append(f"No occurrences found in transcript for the given patch command.")

    return {
        "diffs": all_diffs,
        "occurrences_count": occurrences_count,
        "affected_assets": affected_assets,
        "confidence_score": confidence_score,
        "warnings": warnings,
    }
