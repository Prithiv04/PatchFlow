from typing import List, Optional

from pydantic import BaseModel, Field


class AssetMetadata(BaseModel):
    asset_type: str = Field(..., description="Asset type: 'video', 'transcript', 'captions', 'audio', 'thumbnail'")
    filename: str = Field(..., description="Downloadable filename on the client")
    content_type: str = Field(..., description="MIME type of the asset")
    file_size_bytes: int = Field(..., description="File size in bytes")
    exists: bool = Field(..., description="Whether the file is present on disk")


class DownloadAssetResponse(BaseModel):
    video_id: str = Field(..., description="Target video UUID")
    asset_type: str = Field(..., description="Type of asset exported")
    filename: str = Field(..., description="Downloaded filename")
    content_type: str = Field(..., description="MIME type returned")
    file_size_bytes: int = Field(..., description="Size of returned file in bytes")


class ExportReportResponse(BaseModel):
    video_id: str = Field(..., description="Target video UUID")
    patch_id: str = Field(..., description="Patch proposal UUID")
    version: str = Field(..., description="Version tag (e.g. 'v1.1')")
    prompt: str = Field(..., description="Original patch prompt")
    status: str = Field(..., description="Patch status: 'analyzed' | 'applied' | 'reverted'")
    occurrences_changed: int = Field(..., description="Total text occurrences replaced")
    confidence_score: float = Field(..., description="Overall confidence score (0.0 to 1.0)")
    assets_updated: List[str] = Field(..., description="List of affected asset types")
    diffs: List[dict] = Field(..., description="List of diff records")
    warnings: List[str] = Field(..., description="Review warnings")
    applied_at: Optional[str] = Field(None, description="UTC ISO-8601 timestamp of patch application")
    export_timestamp: str = Field(..., description="UTC ISO-8601 timestamp of report export")


class ExportPackageResponse(BaseModel):
    video_id: str = Field(..., description="Target video UUID")
    assets_included: List[str] = Field(..., description="List of asset types included in the package")
    total_files: int = Field(..., description="Total number of files in the ZIP")
    zip_size_bytes: int = Field(..., description="Total ZIP archive size in bytes")
    export_timestamp: str = Field(..., description="UTC ISO-8601 timestamp of export")
