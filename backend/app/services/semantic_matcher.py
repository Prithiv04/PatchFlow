from difflib import SequenceMatcher
import re
from typing import Any, Dict, List, Optional, Tuple


class SemanticMatcher:
    """
    Semantic Matcher service that compares target text / parsed intent
    against transcript segments to find candidate match locations and compute similarity scores.
    """

    @staticmethod
    def match_target_in_text(target: str, text: str) -> Tuple[float, Optional[str]]:
        """
        Check match score of `target` within `text`.
        Returns (score, matched_substring).
        """
        if not target or not text:
            return 0.0, None

        target_clean = target.strip()
        text_clean = text.strip()

        # 1. Case-insensitive exact substring match (100% confidence)
        pattern = re.compile(re.escape(target_clean), re.IGNORECASE)
        match = pattern.search(text_clean)
        if match:
            return 1.0, match.group(0)

        # 2. Substring fuzzy matching using sliding window over words
        target_lower = target_clean.lower()
        text_lower = text_clean.lower()
        target_words = target_lower.split()
        text_words = text_lower.split()

        if not target_words or not text_words:
            return 0.0, None

        window_size = len(target_words)
        best_score = 0.0
        best_match_str = None

        # Check windows of size window_size, window_size-1, window_size+1
        for size in range(max(1, window_size - 1), min(len(text_words) + 1, window_size + 2)):
            for i in range(len(text_words) - size + 1):
                window_words = text_words[i : i + size]
                window_text = " ".join(window_words)

                ratio = SequenceMatcher(None, target_lower, window_text).ratio()
                if ratio > best_score:
                    best_score = ratio
                    # Get original case substring from text_clean
                    start_idx = text_lower.find(window_text)
                    if start_idx != -1:
                        best_match_str = text_clean[start_idx : start_idx + len(window_text)]
                    else:
                        best_match_str = window_text

        # Return score rounded
        return round(best_score, 2), best_match_str if best_score >= 0.70 else None

    @classmethod
    def find_matches(
        cls,
        target: str,
        replacement: str,
        segments: List[Dict[str, Any]],
        min_threshold: float = 0.70,
    ) -> List[Dict[str, Any]]:
        """
        Find candidate segment matches for a given target and replacement across transcript segments.
        Returns a list of candidate dictionaries ordered by score desc.
        """
        candidates = []
        if not target:
            return candidates

        for seg in segments:
            seg_text = seg.get("text", "")
            seg_id = seg.get("id", 0)
            start_time = seg.get("start", 0.0)
            end_time = seg.get("end", 0.0)

            score, matched_substr = cls.match_target_in_text(target, seg_text)

            if score >= min_threshold and matched_substr:
                # Compute patched text for preview
                pattern = re.compile(re.escape(matched_substr), re.IGNORECASE)
                patched_text = pattern.sub(replacement, seg_text, count=1)

                candidates.append(
                    {
                        "segment_id": seg_id,
                        "start": start_time,
                        "end": end_time,
                        "score": score,
                        "text": seg_text,
                        "matched_text": matched_substr,
                        "target": target,
                        "replacement": replacement,
                        "original": seg_text,
                        "patched": patched_text,
                        "is_exact": (score == 1.0),
                    }
                )

        # Sort candidate matches by score descending, then by segment_id ascending
        candidates.sort(key=lambda c: (-c["score"], c["segment_id"]))
        return candidates
