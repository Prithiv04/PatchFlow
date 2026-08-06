from typing import List, Optional
from pydantic import BaseModel, Field


class PatchApplyResponse(BaseModel):
    patch_id: str = Field(..., description="Unique UUID of the executed patch proposal")
    video_id: str = Field(..., description="Target video UUID")
    version: str = Field(..., description="Assigned version tag (e.g. 'v1.1')")
    status: str = Field("applied", description="Patch status: 'applied'")
    occurrences_changed: int = Field(..., description="Total occurrences replaced")
    assets_updated: List[str] = Field(..., description="List of updated asset types")
    processing_time_seconds: float = Field(..., description="Execution duration in seconds")
    applied_at: str = Field(..., description="UTC ISO-8601 timestamp of patch execution")


class PatchRevertResponse(BaseModel):
    patch_id: str = Field(..., description="Unique UUID of the reverted patch proposal")
    video_id: str = Field(..., description="Target video UUID")
    version: str = Field(..., description="Version tag of reverted patch")
    status: str = Field("reverted", description="Patch status: 'reverted'")
    reverted_at: str = Field(..., description="UTC ISO-8601 timestamp of reversion")


class PatchReportTableItem(BaseModel):
    asset: str = Field(..., description="Asset display name")
    format: str = Field(..., description="File format extension")
    version: str = Field(..., description="Version tag")
    status: str = Field(..., description="Asset status ('Applied', 'Reverted')")
    changes: int = Field(..., description="Number of text replacements in asset")
    confidence: float = Field(..., description="Asset patch confidence percentage")


class PatchReportResponse(BaseModel):
    video_id: str = Field(..., description="Target video UUID")
    patch_id: str = Field(..., description="Patch proposal UUID")
    version: str = Field(..., description="Version tag")
    assets_updated: int = Field(..., description="Number of assets updated")
    occurrences_changed: int = Field(..., description="Total text occurrences replaced")
    processing_time: str = Field(..., description="Execution time string (e.g. '3.8s')")
    patch_success: bool = Field(True, description="Whether patch execution was successful")
    confidence_score: float = Field(..., description="Overall confidence score (0.0 to 1.0)")
    table: List[PatchReportTableItem] = Field(..., description="Breakdown per asset type")


class VideoHistoryItem(BaseModel):
    id: str = Field(..., description="History item ID (patch_id or 'original')")
    version: str = Field(..., description="Version tag (e.g. 'v1.0', 'v1.1')")
    date: str = Field(..., description="Formatted timestamp string")
    author: str = Field("System User", description="Patch author")
    command: str = Field(..., description="Patch command or 'Original asset'")
    summary: str = Field(..., description="Brief summary description")
    assets_affected: List[str] = Field(..., description="List of affected asset types")
    occurrences: int = Field(..., description="Number of replacements")
    status: str = Field(..., description="Status ('applied', 'analyzed', 'reverted')")


class VideoHistoryResponse(BaseModel):
    video_id: str = Field(..., description="Target video UUID")
    total_versions: int = Field(..., description="Total version history entries")
    history: List[VideoHistoryItem] = Field(..., description="Chronological list of version entries")
