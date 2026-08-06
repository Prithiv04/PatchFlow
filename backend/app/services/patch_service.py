import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.logger import logger
from app.db.models import Patch, Transcript, Video
from app.schemas.patch import PatchAnalysisResponse, PatchDiff, PatchListResponse
from app.utils.patch_analyzer import run_patch_analysis


def _build_response(patch: Patch) -> PatchAnalysisResponse:
    """Convert a Patch ORM object into a PatchAnalysisResponse schema."""
    diffs_raw = json.loads(patch.diffs_json or "[]")
    warnings_raw = json.loads(patch.warnings_json or "[]")
    affected_assets_raw = json.loads(patch.affected_assets_json or "[]")

    diffs = [PatchDiff(**d) for d in diffs_raw]

    return PatchAnalysisResponse(
        patch_id=patch.id,
        video_id=patch.video_id,
        prompt=patch.prompt,
        status=patch.status,
        occurrences_count=patch.occurrences_count,
        affected_assets=affected_assets_raw,
        diffs=diffs,
        confidence_score=patch.confidence_score,
        warnings=warnings_raw,
        version=patch.version,
        created_at=patch.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
    )


class PatchService:
    @staticmethod
    async def analyze_patch(
        db: Session,
        video_id: str,
        prompt: str,
    ) -> PatchAnalysisResponse:
        """
        Parse a declarative patch prompt, analyze it against stored transcript,
        persist the patch proposal, and return the structured diff response.
        """
        logger.info("Patch analysis requested for video_id='%s'", video_id)

        # 1. Verify video exists in DB
        video: Optional[Video] = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video with ID '{video_id}' not found.",
            )

        # 2. Retrieve transcript — may be None if transcription not yet run
        transcript: Optional[Transcript] = (
            db.query(Transcript).filter(Transcript.video_id == video_id).first()
        )

        full_text = transcript.full_text if transcript else ""
        segments = json.loads(transcript.segments_json) if transcript else []

        # 3. Run declarative patch analysis engine
        analysis = run_patch_analysis(
            prompt=prompt,
            full_text=full_text,
            segments=segments,
        )

        # 4. Calculate version tag based on existing patch count
        existing_count = db.query(Patch).filter(Patch.video_id == video_id).count()
        version = f"v1.{existing_count + 1}"

        # 5. Persist patch proposal to DB
        patch_id = str(uuid.uuid4())
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

        patch = Patch(
            id=patch_id,
            video_id=video_id,
            prompt=prompt,
            status="analyzed",
            occurrences_count=analysis["occurrences_count"],
            affected_assets_json=json.dumps(analysis["affected_assets"]),
            diffs_json=json.dumps(analysis["diffs"]),
            confidence_score=analysis["confidence_score"],
            warnings_json=json.dumps(analysis["warnings"]),
            version=version,
            created_at=now_utc,
        )
        db.add(patch)
        db.commit()
        db.refresh(patch)

        logger.info(
            "Patch analysis completed for video_id='%s': patch_id='%s', occurrences=%d",
            video_id,
            patch_id,
            analysis["occurrences_count"],
        )

        return _build_response(patch)

    @staticmethod
    async def list_patches(db: Session, video_id: str) -> PatchListResponse:
        """List all patch proposals for a given video."""
        # Verify video exists
        video: Optional[Video] = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video with ID '{video_id}' not found.",
            )

        patches = (
            db.query(Patch)
            .filter(Patch.video_id == video_id)
            .order_by(Patch.created_at.asc())
            .all()
        )

        return PatchListResponse(
            video_id=video_id,
            total=len(patches),
            patches=[_build_response(p) for p in patches],
        )

    @staticmethod
    async def get_patch(db: Session, patch_id: str) -> PatchAnalysisResponse:
        """Retrieve a specific patch proposal by its ID."""
        patch: Optional[Patch] = db.query(Patch).filter(Patch.id == patch_id).first()
        if not patch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patch with ID '{patch_id}' not found.",
            )
        return _build_response(patch)
