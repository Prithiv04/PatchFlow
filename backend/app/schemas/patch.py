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


class PatchListResponse(BaseModel):
    video_id: str = Field(..., description="UUID of the target video")
    total: int = Field(..., description="Total number of patches for this video")
    patches: List[PatchAnalysisResponse] = Field(..., description="List of patch proposals")
