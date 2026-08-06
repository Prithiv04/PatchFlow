from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.patch import PatchAnalysisRequest, PatchAnalysisResponse, PatchListResponse
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
