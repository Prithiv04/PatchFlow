import re
from typing import Any, Dict, List
from app.services.ai_patch_service import AIPatchService
from app.services.semantic_matcher import SemanticMatcher


def parse_prompt(prompt: str):
    """
    Parse a declarative patch prompt to extract (target, replacement) pairs.
    Maintained for backward compatibility.
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
    Run Sprint 9 AI-powered patch analysis pipeline against transcript data:
    1. Parse natural language intent (AIPatchService)
    2. Perform semantic & exact matching (SemanticMatcher)
    3. Calculate confidence and safety thresholds
    Returns diffs, occurrences, affected_assets, confidence_score, warnings, and candidates.
    """
    intent = AIPatchService.parse_intent(prompt)
    
    target = intent.target
    replacement = intent.replacement

    # Fallback to legacy parser if intent service didn't find target/replacement
    if not target or not replacement:
        pairs = parse_prompt(prompt)
        if pairs:
            target = pairs[0]["target"]
            replacement = pairs[0]["replacement"]

    if not target:
        return {
            "diffs": [],
            "occurrences_count": 0,
            "affected_assets": [],
            "confidence_score": 0.0,
            "warnings": [
                "Could not parse patch command. Use natural instructions like: "
                "'Replace X with Y' or 'Change X to Y'."
            ],
            "parsed_operation": intent.operation,
            "parsed_target": "",
            "parsed_replacement": "",
            "candidate_segments": [],
        }

    # Find candidate segment matches
    candidates = SemanticMatcher.find_matches(
        target=target,
        replacement=replacement,
        segments=segments,
        min_threshold=0.70,
    )

    all_diffs: List[Dict[str, Any]] = []
    affected_asset_types: set = set()

    for cand in candidates:
        all_diffs.append({
            "asset_type": "transcript",
            "segment_id": cand["segment_id"],
            "start": cand["start"],
            "end": cand["end"],
            "original": cand["original"],
            "patched": cand["patched"],
            "target": cand["matched_text"] or cand["target"],
            "replacement": replacement,
        })
        affected_asset_types.add("transcript")
        affected_asset_types.add("captions")

    occurrences_count = len(all_diffs)
    affected_assets = sorted(affected_asset_types) if occurrences_count > 0 else []

    # Calculate confidence score
    if occurrences_count > 0:
        best_candidate_score = max(c["score"] for c in candidates)
        if all(c["is_exact"] for c in candidates):
            confidence_score = 1.0
        else:
            confidence_score = round(best_candidate_score, 2)
    else:
        confidence_score = 0.0

    # Safety Layer: If confidence < 0.50, do not apply any modifications
    if confidence_score < 0.50:
        all_diffs = []
        occurrences_count = 0
        affected_assets = []

    warnings = []
    if occurrences_count > 0:
        warnings.append(
            "This patch modifies text elements only. Audio and video tracks remain unchanged."
        )
        if any(not c["is_exact"] for c in candidates):
            warnings.append("Ambiguous or semantic match detected. Please review candidate segments.")
    else:
        warnings.append(f"No occurrences found in transcript for the given patch command.")

    return {
        "diffs": all_diffs,
        "occurrences_count": occurrences_count,
        "affected_assets": affected_assets,
        "confidence_score": confidence_score,
        "warnings": warnings,
        "parsed_operation": intent.operation,
        "parsed_target": target,
        "parsed_replacement": replacement,
        "candidate_segments": candidates,
    }
