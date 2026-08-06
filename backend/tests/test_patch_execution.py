"""
Backend Sprint 6 tests — Patch Execution, Application, Reversion, Reporting & History.
"""
import json
import uuid
from typing import Tuple
import pytest
from fastapi.testclient import TestClient

from app.db.models import Patch, Transcript, Video
from app.main import app
from tests.conftest import TestingSessionLocal

client = TestClient(app)


def _seed_video_and_transcript(db, video_id: str) -> Tuple[Video, Transcript]:
    """Helper to seed video and transcript in DB."""
    video = Video(
        id=video_id,
        original_filename="demo.mp4",
        saved_filename=f"{video_id}.mp4",
        content_type="video/mp4",
        file_size=2048,
        status="transcribed",
    )
    db.add(video)

    segments = [
        {"id": 0, "start": 0.0, "end": 2.5, "text": "This is a demo of GPT-4 capabilities."},
        {"id": 1, "start": 2.5, "end": 5.0, "text": "GPT-4 handles complex prompts easily."},
    ]
    transcript = Transcript(
        video_id=video_id,
        language="en",
        full_text="This is a demo of GPT-4 capabilities. GPT-4 handles complex prompts easily.",
        segments_json=json.dumps(segments),
        transcript_path=f"transcripts/{video_id}.json",
        caption_path=f"captions/{video_id}.srt",
    )
    db.add(transcript)
    db.commit()
    return video, transcript


def test_apply_patch_success():
    """Test successful patch application updates transcript, captions, and DB status."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    # 1. Analyze patch
    analyze_resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    assert analyze_resp.status_code == 200
    patch_id = analyze_resp.json()["patch_id"]

    # 2. Apply patch
    apply_resp = client.post(f"/api/v1/videos/{video_id}/patches/{patch_id}/apply")
    assert apply_resp.status_code == 200
    apply_data = apply_resp.json()

    assert apply_data["patch_id"] == patch_id
    assert apply_data["video_id"] == video_id
    assert apply_data["status"] == "applied"
    assert apply_data["occurrences_changed"] == 2
    assert "applied_at" in apply_data

    # 3. Verify Patch and Video status in DB
    db = TestingSessionLocal()
    db_patch = db.query(Patch).filter(Patch.id == patch_id).first()
    assert db_patch.status == "applied"
    assert db_patch.applied_at is not None

    db_video = db.query(Video).filter(Video.id == video_id).first()
    assert db_video.status == "patched"
    db.close()


def test_apply_patch_already_applied():
    """Test 400 error when applying an already applied patch."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    analyze_resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    patch_id = analyze_resp.json()["patch_id"]

    client.post(f"/api/v1/videos/{video_id}/patches/{patch_id}/apply")
    repeat_resp = client.post(f"/api/v1/videos/{video_id}/patches/{patch_id}/apply")
    assert repeat_resp.status_code == 400
    assert "already been applied" in repeat_resp.json()["detail"].lower()


def test_revert_patch_success():
    """Test reverting an applied patch restores text and updates status."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    analyze_resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    patch_id = analyze_resp.json()["patch_id"]

    client.post(f"/api/v1/videos/{video_id}/patches/{patch_id}/apply")

    revert_resp = client.post(f"/api/v1/videos/{video_id}/patches/{patch_id}/revert")
    assert revert_resp.status_code == 200
    revert_data = revert_resp.json()
    assert revert_data["status"] == "reverted"
    assert revert_data["patch_id"] == patch_id

    # Verify DB status
    db = TestingSessionLocal()
    db_patch = db.query(Patch).filter(Patch.id == patch_id).first()
    assert db_patch.status == "reverted"
    db.close()


def test_revert_patch_not_applied():
    """Test 400 error when trying to revert an unapplied patch."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    analyze_resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    patch_id = analyze_resp.json()["patch_id"]

    revert_resp = client.post(f"/api/v1/videos/{video_id}/patches/{patch_id}/revert")
    assert revert_resp.status_code == 400
    assert "cannot revert" in revert_resp.json()["detail"].lower()


def test_get_patch_report():
    """Test fetching patch analytics report."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    analyze_resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    patch_id = analyze_resp.json()["patch_id"]

    client.post(f"/api/v1/videos/{video_id}/patches/{patch_id}/apply")

    report_resp = client.get(f"/api/v1/videos/{video_id}/patches/{patch_id}/report")
    assert report_resp.status_code == 200
    report_data = report_resp.json()

    assert report_data["video_id"] == video_id
    assert report_data["patch_id"] == patch_id
    assert report_data["patch_success"] is True
    assert report_data["occurrences_changed"] == 2
    assert len(report_data["table"]) >= 1


def test_get_video_history():
    """Test retrieving full version timeline history for a video."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    analyze_resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    patch_id = analyze_resp.json()["patch_id"]
    client.post(f"/api/v1/videos/{video_id}/patches/{patch_id}/apply")

    history_resp = client.get(f"/api/v1/videos/{video_id}/history")
    assert history_resp.status_code == 200
    history_data = history_resp.json()

    assert history_data["video_id"] == video_id
    assert history_data["total_versions"] == 2
    assert history_data["history"][0]["version"] == "v1.0"
    assert history_data["history"][1]["version"] == "v1.1"
    assert history_data["history"][1]["status"] == "applied"
