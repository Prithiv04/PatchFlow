from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PatchDiff(BaseModel):
    asset_type: str = Field(..., description="Asset type affected ('transcript', 'captions')")
    segment_id: int = Field(..., description="Transcript segment ID")
    start: float = Field(..., description="Segment start time in seconds")
    end: float = Field(..., description="Segment end time in seconds")
    original: str = Field(..., description="Original text before patch")
    patched: str = Field(..., description="Text after patch replacement")
    target: str = Field(..., description="Pattern being replaced")
    replacement: str = Field(..., description="Replacement value")


class SegmentCandidate(BaseModel):
    segment_id: int = Field(..., description="Segment ID")
    start: float = Field(..., description="Start timestamp")
    end: float = Field(..., description="End timestamp")
    score: float = Field(..., description="Matching confidence score (0.0 to 1.0)")
    text: str = Field(..., description="Original segment text")
    matched_text: Optional[str] = Field(None, description="Matched substring text")
    target: str = Field(..., description="Target pattern")
    replacement: str = Field(..., description="Replacement text")
    original: str = Field(..., description="Original text")
    patched: str = Field(..., description="Patched text preview")
    is_exact: bool = Field(True, description="Whether match is exact or semantic")


class PatchAnalysisRequest(BaseModel):
    prompt: str = Field(
        ...,
        description="Natural language patch command",
        examples=["Replace every occurrence of GPT-4 with GPT-5."]
    )


class PatchAnalysisResponse(BaseModel):
    patch_id: str = Field(..., description="Unique UUID for this patch proposal")
    video_id: str = Field(..., description="UUID of the target video")
    prompt: str = Field(..., description="Original patch prompt text")
    status: str = Field("analyzed", description="Patch status: 'analyzed' | 'applied' | 'reverted'")
    occurrences_count: int = Field(..., description="Total number of target occurrences found")
    affected_assets: List[str] = Field(..., description="List of affected asset types")
    diffs: List[PatchDiff] = Field(..., description="List of diff records showing before/after changes")
    confidence_score: float = Field(..., description="Analysis confidence score (0.0 to 1.0)")
    warnings: List[str] = Field(..., description="Review warnings for this patch")
    version: Optional[str] = Field(None, description="Assigned version tag (e.g. 'v1.1')")
    created_at: str = Field(..., description="Patch creation timestamp in UTC ISO-8601 format")
    # Sprint 9 AI Intent & Semantic Candidate fields
    parsed_operation: Optional[str] = Field(None, description="Parsed operation (e.g. 'replace')")
    parsed_target: Optional[str] = Field(None, description="Parsed target text")
    parsed_replacement: Optional[str] = Field(None, description="Parsed replacement text")
    candidate_segments: Optional[List[SegmentCandidate]] = Field(None, description="Candidate segment matches")


class PatchListResponse(BaseModel):
    video_id: str = Field(..., description="UUID of the target video")
    total: int = Field(..., description="Total number of patches for this video")
    patches: List[PatchAnalysisResponse] = Field(..., description="List of patch proposals")
