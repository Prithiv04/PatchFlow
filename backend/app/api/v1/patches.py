from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.patch import PatchAnalysisRequest, PatchAnalysisResponse, PatchListResponse
from app.schemas.patch_execution import (
    PatchApplyResponse,
    PatchReportResponse,
    PatchRevertResponse,
    VideoHistoryResponse,
)
from app.services.patch_service import PatchService

router = APIRouter()

@router.post(
    "/{video_id}/patches/analyze",
    response_model=PatchAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a declarative patch prompt",
    description=(
        "Parses a natural language patch command (e.g. 'Replace GPT-4 with GPT-5'), "
        "runs analysis against the stored transcript, persists the patch proposal, "
        "and returns structured diffs and affected assets."
    ),
)
async def analyze_patch(
    video_id: str,
    request: PatchAnalysisRequest,
    db: Session = Depends(get_db),
) -> PatchAnalysisResponse:
    return await PatchService.analyze_patch(db=db, video_id=video_id, prompt=request.prompt)


@router.get(
    "/{video_id}/patches",
    response_model=PatchListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all patch proposals for a video",
    description="Returns all historical patch proposals associated with the given video ID.",
)
async def list_patches(
    video_id: str,
    db: Session = Depends(get_db),
) -> PatchListResponse:
    return await PatchService.list_patches(db=db, video_id=video_id)


@router.get(
    "/patches/{patch_id}",
    response_model=PatchAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a specific patch proposal by ID",
    description="Returns full details of a patch proposal, including diffs and affected assets.",
)
async def get_patch(
    patch_id: str,
    db: Session = Depends(get_db),
) -> PatchAnalysisResponse:
    return await PatchService.get_patch(db=db, patch_id=patch_id)


@router.post(
    "/{video_id}/patches/{patch_id}/apply",
    response_model=PatchApplyResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute patch proposal application",
    description=(
        "Executes target text replacements across stored transcript JSON and SRT captions, "
        "updates patch status to 'applied', and records execution metrics."
    ),
)
async def apply_patch(
    video_id: str,
    patch_id: str,
    db: Session = Depends(get_db),
) -> PatchApplyResponse:
    return await PatchService.apply_patch(db=db, video_id=video_id, patch_id=patch_id)


@router.post(
    "/{video_id}/patches/{patch_id}/revert",
    response_model=PatchRevertResponse,
    status_code=status.HTTP_200_OK,
    summary="Revert an applied patch",
    description="Rolls back target text replacements in transcript and captions, updating patch status to 'reverted'.",
)
async def revert_patch(
    video_id: str,
    patch_id: str,
    db: Session = Depends(get_db),
) -> PatchRevertResponse:
    return await PatchService.revert_patch(db=db, video_id=video_id, patch_id=patch_id)


@router.get(
    "/{video_id}/patches/{patch_id}/report",
    response_model=PatchReportResponse,
    status_code=status.HTTP_200_OK,
    summary="Get patch analytics breakdown report",
    description="Compiles asset breakdown metrics, confidence scores, and total replacements for reporting.",
)
async def get_patch_report(
    video_id: str,
    patch_id: str,
    db: Session = Depends(get_db),
) -> PatchReportResponse:
    return await PatchService.get_patch_report(db=db, video_id=video_id, patch_id=patch_id)


@router.get(
    "/{video_id}/history",
    response_model=VideoHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get video patch version history timeline",
    description="Retrieves complete version history timeline (v1.0 original, v1.1, v1.2, etc.) for a video.",
)
async def get_video_history(
    video_id: str,
    db: Session = Depends(get_db),
) -> VideoHistoryResponse:
    return await PatchService.get_video_history(db=db, video_id=video_id)
