import json
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logger import logger
from app.db.models import Patch, Transcript, Video
from app.schemas.patch import PatchAnalysisResponse, PatchDiff, PatchListResponse
from app.schemas.patch_execution import (
    PatchApplyResponse,
    PatchReportResponse,
    PatchReportTableItem,
    PatchRevertResponse,
    VideoHistoryItem,
    VideoHistoryResponse,
)
from app.utils.caption_utils import export_srt_file
from app.utils.patch_analyzer import run_patch_analysis
from app.utils.patch_executor import apply_patch_to_srt, apply_patch_to_transcript


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

    @staticmethod
    async def apply_patch(
        db: Session,
        video_id: str,
        patch_id: str,
    ) -> PatchApplyResponse:
        """
        Execute a patch proposal: apply text diffs to stored transcript & captions,
        update database statuses, and record execution metrics.
        """
        start_time = time.time()
        logger.info("Patch execution requested for video_id='%s', patch_id='%s'", video_id, patch_id)

        # 1. Retrieve Patch record
        patch: Optional[Patch] = db.query(Patch).filter(Patch.id == patch_id, Patch.video_id == video_id).first()
        if not patch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patch with ID '{patch_id}' not found for video '{video_id}'.",
            )

        if patch.status == "applied":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Patch '{patch_id}' has already been applied.",
            )

        # 2. Retrieve Transcript record
        transcript: Optional[Transcript] = db.query(Transcript).filter(Transcript.video_id == video_id).first()
        if not transcript:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No transcript found for video '{video_id}'. Run transcription first.",
            )

        diffs = json.loads(patch.diffs_json or "[]")
        segments = json.loads(transcript.segments_json or "[]")

        # 3. Apply text replacements to transcript segments
        patched_segments, patched_full_text, total_replacements = apply_patch_to_transcript(segments, diffs)

        # 4. Update Transcript ORM model & JSON file
        transcript.segments_json = json.dumps(patched_segments)
        transcript.full_text = patched_full_text

        transcript_file = settings.transcript_path / f"{video_id}.json"
        if transcript_file.exists():
            data = json.loads(transcript_file.read_text(encoding="utf-8"))
            data["full_text"] = patched_full_text
            data["segments"] = patched_segments
            transcript_file.write_text(json.dumps(data, indent=2), encoding="utf-8")

        # 5. Update SRT caption file
        caption_file = settings.caption_path / f"{video_id}.srt"
        if caption_file.exists():
            srt_content = caption_file.read_text(encoding="utf-8")
            patched_srt = apply_patch_to_srt(srt_content, diffs)
            caption_file.write_text(patched_srt, encoding="utf-8")
        else:
            export_srt_file(patched_segments, caption_file)

        # 6. Update Patch and Video statuses in DB
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        patch.status = "applied"
        patch.applied_at = now_utc

        video: Optional[Video] = db.query(Video).filter(Video.id == video_id).first()
        if video:
            video.status = "patched"
            video.updated_at = now_utc

        db.commit()

        elapsed = round(time.time() - start_time, 3)
        affected_assets = json.loads(patch.affected_assets_json or "[]")

        logger.info(
            "Patch execution completed for video_id='%s', patch_id='%s': %d replacements in %ss",
            video_id,
            patch_id,
            total_replacements,
            elapsed,
        )

        return PatchApplyResponse(
            patch_id=patch.id,
            video_id=video_id,
            version=patch.version or "v1.1",
            status="applied",
            occurrences_changed=total_replacements,
            assets_updated=affected_assets,
            processing_time_seconds=elapsed,
            applied_at=now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        )

    @staticmethod
    async def revert_patch(
        db: Session,
        video_id: str,
        patch_id: str,
    ) -> PatchRevertResponse:
        """
        Revert an applied patch back to the previous state.
        """
        logger.info("Patch revert requested for video_id='%s', patch_id='%s'", video_id, patch_id)

        patch: Optional[Patch] = db.query(Patch).filter(Patch.id == patch_id, Patch.video_id == video_id).first()
        if not patch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patch with ID '{patch_id}' not found for video '{video_id}'.",
            )

        if patch.status != "applied":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot revert patch '{patch_id}' with status '{patch.status}'.",
            )

        diffs = json.loads(patch.diffs_json or "[]")

        # Invert target and replacement in diffs for reversion
        inverted_diffs = []
        for diff in diffs:
            inv_diff = dict(diff)
            inv_diff["target"] = diff["replacement"]
            inv_diff["replacement"] = diff["target"]
            inverted_diffs.append(inv_diff)

        transcript: Optional[Transcript] = db.query(Transcript).filter(Transcript.video_id == video_id).first()
        if transcript:
            segments = json.loads(transcript.segments_json or "[]")
            reverted_segments, reverted_full_text, _ = apply_patch_to_transcript(segments, inverted_diffs)

            transcript.segments_json = json.dumps(reverted_segments)
            transcript.full_text = reverted_full_text

            transcript_file = settings.transcript_path / f"{video_id}.json"
            if transcript_file.exists():
                data = json.loads(transcript_file.read_text(encoding="utf-8"))
                data["full_text"] = reverted_full_text
                data["segments"] = reverted_segments
                transcript_file.write_text(json.dumps(data, indent=2), encoding="utf-8")

            caption_file = settings.caption_path / f"{video_id}.srt"
            if caption_file.exists():
                srt_content = caption_file.read_text(encoding="utf-8")
                reverted_srt = apply_patch_to_srt(srt_content, inverted_diffs)
                caption_file.write_text(reverted_srt, encoding="utf-8")

        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        patch.status = "reverted"

        # If no other patches are applied, revert video status to transcribed
        other_applied = (
            db.query(Patch)
            .filter(Patch.video_id == video_id, Patch.status == "applied", Patch.id != patch_id)
            .count()
        )
        video: Optional[Video] = db.query(Video).filter(Video.id == video_id).first()
        if video and other_applied == 0:
            video.status = "transcribed"

        db.commit()

        logger.info("Patch revert completed for video_id='%s', patch_id='%s'", video_id, patch_id)

        return PatchRevertResponse(
            patch_id=patch.id,
            video_id=video_id,
            version=patch.version or "v1.1",
            status="reverted",
            reverted_at=now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        )

    @staticmethod
    async def get_patch_report(
        db: Session,
        video_id: str,
        patch_id: str,
    ) -> PatchReportResponse:
        """Compile execution breakdown report for a patch."""
        patch: Optional[Patch] = db.query(Patch).filter(Patch.id == patch_id, Patch.video_id == video_id).first()
        if not patch:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patch with ID '{patch_id}' not found for video '{video_id}'.",
            )

        diffs = json.loads(patch.diffs_json or "[]")
        affected_assets = json.loads(patch.affected_assets_json or "[]")

        table_items = []
        if "transcript" in affected_assets or not affected_assets:
            table_items.append(
                PatchReportTableItem(
                    asset="Transcript",
                    format="JSON",
                    version=patch.version or "v1.1",
                    status="Applied" if patch.status == "applied" else patch.status.capitalize(),
                    changes=patch.occurrences_count,
                    confidence=round(patch.confidence_score * 100, 1),
                )
            )
        if "captions" in affected_assets or not affected_assets:
            table_items.append(
                PatchReportTableItem(
                    asset="Captions (.srt)",
                    format="SRT",
                    version=patch.version or "v1.1",
                    status="Applied" if patch.status == "applied" else patch.status.capitalize(),
                    changes=patch.occurrences_count,
                    confidence=round(patch.confidence_score * 100, 1),
                )
            )

        return PatchReportResponse(
            video_id=video_id,
            patch_id=patch_id,
            version=patch.version or "v1.1",
            assets_updated=len(table_items),
            occurrences_changed=patch.occurrences_count,
            processing_time="0.8s",
            patch_success=patch.status == "applied",
            confidence_score=patch.confidence_score,
            table=table_items,
        )

    @staticmethod
    async def get_video_history(
        db: Session,
        video_id: str,
    ) -> VideoHistoryResponse:
        """Retrieve complete version timeline history for a video."""
        video: Optional[Video] = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Video with ID '{video_id}' not found.",
            )

        history_items: List[VideoHistoryItem] = [
            VideoHistoryItem(
                id="original",
                version="v1.0",
                date=video.created_at.strftime("%Y-%m-%d %H:%M UTC"),
                author="System",
                command="Original Video Asset",
                summary="Initial video upload before patches.",
                assets_affected=[],
                occurrences=0,
                status="applied",
            )
        ]

        patches = (
            db.query(Patch)
            .filter(Patch.video_id == video_id)
            .order_by(Patch.created_at.asc())
            .all()
        )

        for p in patches:
            history_items.append(
                VideoHistoryItem(
                    id=p.id,
                    version=p.version or "v1.1",
                    date=p.created_at.strftime("%Y-%m-%d %H:%M UTC"),
                    author="System User",
                    command=p.prompt,
                    summary=f"Text patch prompt: '{p.prompt}'",
                    assets_affected=json.loads(p.affected_assets_json or "[]"),
                    occurrences=p.occurrences_count,
                    status=p.status,
                )
            )

        return VideoHistoryResponse(
            video_id=video_id,
            total_versions=len(history_items),
            history=history_items,
        )
