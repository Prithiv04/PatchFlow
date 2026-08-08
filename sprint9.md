Phase 1 — Audit existing AI patch engine

Before changing anything:

inspect current patch analyzer
inspect patch schemas
inspect matching logic
inspect existing confidence calculation
inspect transcript segment structure
inspect current patch API
identify where exact matching currently happens

No unnecessary rewrite.

Phase 2 — AI Patch Intent Parser

Create a dedicated service/module, for example:

backend/app/services/ai_patch_service.py

Responsibilities:

Natural language command
        ↓
Extract operation
        ↓
Extract target
        ↓
Extract replacement
        ↓
Return structured intent

Example:

{
  "operation": "replace",
  "target": "Q3 2025",
  "replacement": "Q4 2025",
  "confidence": 0.96
}
Phase 3 — Semantic Matching Layer

Create a matcher that compares the parsed intent against transcript segments.

Input:

Intent
+
Transcript segments

Output:

{
  "matches": [
    {
      "segment_id": 4,
      "score": 0.94,
      "text": "..."
    }
  ]
}

Keep exact matching as the highest-confidence path when an exact target is explicitly provided.

Phase 4 — Confidence & Safety Layer

Implement:

confidence
candidate ranking
minimum threshold
ambiguous match detection
no-match handling

Example:

Exact match
    ↓
100% confidence

Strong semantic match
    ↓
90%+

Ambiguous semantic matches
    ↓
70–89%

Weak match
    ↓
<70%

The exact numerical thresholds should be determined from your existing architecture/tests rather than arbitrarily replacing existing confidence logic.

Phase 5 — Patch API Integration

Modify the existing:

POST /api/v1/videos/{video_id}/patches/analyze

so the flow becomes:

Request
 ↓
AI intent parser
 ↓
Semantic matcher
 ↓
Confidence evaluation
 ↓
PatchAnalysisResponse

The existing response structure should remain compatible with the frontend wherever possible.

Phase 6 — Frontend Patch Proposal UI

Your existing Create Patch page should display richer information.

For example:

Patch Proposal

Instruction
"Update the quarterly reference to Q4 2025"

AI Understanding
Operation: Replace
Target: Q3 2025
Replacement: Q4 2025

Matches Found
2 candidate segments

Confidence
94%

Affected Assets
✓ Transcript
✓ Captions

Preview
Q3 2025 → Q4 2025

[Apply Patch]

For ambiguous matches:

⚠ Multiple possible matches

Which occurrence should be changed?

○ Segment 14 — 94%
○ Segment 27 — 82%

[Continue]
Phase 7 — Testing

Add tests for:

Exact matching
Replace "PatchFlow" with "PatchFlow AI"

Expected:

1 occurrence
Natural-language instruction
Change PatchFlow to PatchFlow AI

Expected:

target = PatchFlow
replacement = PatchFlow AI
No match
Replace GPT-4 with GPT-5

when GPT-4 doesn't exist.

Expected:

0 matches
no modification
Ambiguous match

Multiple semantically similar segments.

Expected:

multiple candidates
no automatic modification
Revert

Ensure Sprint 8's existing:

Apply → Version → Revert

still works.

Phase 8 — Regression Verification

Run:

cd backend
python -m pytest -q

Then:

cd ..\frontend
npm run build

And manually test:

Upload
  ↓
Process
  ↓
Transcribe
  ↓
Create natural-language patch
  ↓
AI understands instruction
  ↓
Candidate matches
  ↓
Confidence
  ↓
Preview
  ↓
Apply
  ↓
History
  ↓
Report
  ↓
Revert
📁 Expected Sprint 9 Scope

Likely additions/modifications:

backend/
├── app/
│   ├── services/
│   │   ├── ai_patch_service.py       NEW
│   │   ├── semantic_matcher.py       NEW
│   │   └── patch_service.py          MODIFY
│   │
│   ├── schemas/
│   │   └── patch.py                  MODIFY
│   │
│   └── api/
│       └── routes/
│           └── patches.py             MODIFY

frontend/
├── src/
│   ├── pages/
│   │   └── CreatePatchPage.tsx        MODIFY
│   │
│   ├── components/
│   │   └── PatchCandidates.tsx        NEW
│   │
│   └── types/
│       └── api.ts                     MODIFY

But these are proposed paths, not instructions to blindly create every file. Antigravity should first inspect your actual repository structure.

🚫 What Sprint 9 should NOT do

Don't let it expand the sprint unnecessarily.

Sprint 9 should not be about:

authentication
Docker
deployment
CI/CD
cloud infrastructure
monitoring
major UI redesign
completely rewriting the patch engine
YouTube API publishing
advanced video rendering
unrelated frontend features

Those belong to later production/deployment stages.

🏁 Sprint 9 Definition of Done

I'd consider Sprint 9 complete when this works:

User:
"Change the quarterly reference from Q3 2025
to Q4 2025."

             ↓

       AI understands intent

             ↓

Operation: REPLACE
Target: Q3 2025
Replacement: Q4 2025

             ↓

    Semantic/exact matching

             ↓

Candidate segments + confidence

             ↓

      Patch Preview

             ↓

        Apply Patch

             ↓

Transcript + SRT modified

             ↓

     Version created

             ↓

History + Report updated

             ↓

          Revert works

And crucially:

No confident match → no modification.