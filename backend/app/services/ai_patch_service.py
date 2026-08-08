import re
from dataclasses import dataclass, asdict
from typing import Dict, Any, Optional, List, Tuple


@dataclass
class ParsedIntent:
    operation: str
    target: str
    replacement: str
    confidence: float
    raw_prompt: str


class AIPatchService:
    """
    Service responsible for parsing natural language patch instructions into
    structured operational intents (operation, target, replacement, confidence).
    """

    @staticmethod
    def parse_intent(prompt: str) -> ParsedIntent:
        p = prompt.strip()
        if not p:
            return ParsedIntent(
                operation="replace",
                target="",
                replacement="",
                confidence=0.0,
                raw_prompt=prompt,
            )

        # 1. Check double/single quoted pairs (highest confidence)
        # e.g. Replace "GPT-4" with "GPT-5" or Update 'Q3 2025' to 'Q4 2025'
        quoted_matches = re.findall(r'["\']([^"\']+)["\']', p)
        if len(quoted_matches) >= 2:
            return ParsedIntent(
                operation="replace",
                target=quoted_matches[0].strip(),
                replacement=quoted_matches[1].strip(),
                confidence=0.98,
                raw_prompt=prompt,
            )

        # 2. Comprehensive regex patterns for standard natural language patch commands

        # Pattern: replace [every/all] [occurrence(s) of] TARGET with REPLACEMENT
        m = re.search(
            r'replace\s+(?:every\s+|all\s+)?(?:occurrence\s+of\s+|instances?\s+of\s+)?(.+?)\s+with\s+(.+)',
            p,
            re.IGNORECASE,
        )
        if m:
            target, replacement = m.group(1).strip(), m.group(2).strip()
            # Clean up leading/trailing punctuation if present
            return ParsedIntent(
                operation="replace",
                target=target,
                replacement=replacement,
                confidence=0.95,
                raw_prompt=prompt,
            )

        # Pattern: update/change [all] [the] ... from TARGET to REPLACEMENT
        m = re.search(
            r'(?:update|change|swap)\s+(?:all\s+)?(?:the\s+)?(?:.+?\s+)?from\s+(.+?)\s+to\s+(.+)',
            p,
            re.IGNORECASE,
        )
        if m:
            target, replacement = m.group(1).strip(), m.group(2).strip()
            return ParsedIntent(
                operation="replace",
                target=target,
                replacement=replacement,
                confidence=0.92,
                raw_prompt=prompt,
            )

        # Pattern: change/update/swap TARGET to/for REPLACEMENT
        m = re.search(
            r'(?:change|update|swap|fix)\s+(?:every\s+|all\s+)?(?:occurrence\s+of\s+)?(.+?)\s+(?:to|for)\s+(.+)',
            p,
            re.IGNORECASE,
        )
        if m:
            target, replacement = m.group(1).strip(), m.group(2).strip()
            # Remove trailing words like "throughout"
            replacement = re.sub(r'\s+throughout$', '', replacement, flags=re.IGNORECASE).strip()
            return ParsedIntent(
                operation="replace",
                target=target,
                replacement=replacement,
                confidence=0.90,
                raw_prompt=prompt,
            )

        # Pattern: "from TARGET to REPLACEMENT" anywhere
        m = re.search(r'from\s+(.+?)\s+to\s+(.+)', p, re.IGNORECASE)
        if m:
            return ParsedIntent(
                operation="replace",
                target=m.group(1).strip(),
                replacement=m.group(2).strip(),
                confidence=0.85,
                raw_prompt=prompt,
            )

        # Fallback: if no pattern matched, attempt best-effort heuristic
        tokens = p.split()
        if len(tokens) >= 3:
            return ParsedIntent(
                operation="replace",
                target=tokens[0],
                replacement=tokens[-1],
                confidence=0.40,
                raw_prompt=prompt,
            )

        return ParsedIntent(
            operation="replace",
            target="",
            replacement="",
            confidence=0.0,
            raw_prompt=prompt,
        )
