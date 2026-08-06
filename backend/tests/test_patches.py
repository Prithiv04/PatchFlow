"""
Backend Sprint 5 tests — Database Persistence & Declarative Patch Engine.

Uses the shared in-memory SQLite database configured in conftest.py.
"""
import json
import uuid
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.db.models import Base, Transcript, Video
from app.main import app
from tests.conftest import test_engine, TestingSessionLocal

client = TestClient(app)


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
def _seed_video(db, video_id: str) -> Video:
    """Insert a minimal Video record for testing."""
    video = Video(
        id=video_id,
        original_filename="test.mp4",
        saved_filename=f"{video_id}.mp4",
        content_type="video/mp4",
        file_size=1024,
        status="uploaded",
    )
    db.add(video)
    db.commit()
    return video


def _seed_transcript(db, video_id: str) -> Transcript:
    """Insert a minimal Transcript record for testing."""
    segments = [
        {"id": 0, "start": 0.0, "end": 2.5, "text": "This is a demo of GPT-4 capabilities."},
        {"id": 1, "start": 2.5, "end": 5.0, "text": "GPT-4 can understand complex instructions."},
        {"id": 2, "start": 5.0, "end": 8.0, "text": "We will now upgrade from GPT-4 to GPT-5."},
    ]
    transcript = Transcript(
        video_id=video_id,
        language="en",
        full_text=" ".join(s["text"] for s in segments),
        segments_json=json.dumps(segments),
        transcript_path=f"transcripts/{video_id}.json",
        caption_path=f"captions/{video_id}.srt",
    )
    db.add(transcript)
    db.commit()
    return transcript


# ─────────────────────────────────────────────
# Database Model Tests
# ─────────────────────────────────────────────
def test_db_tables_created():
    """Verify all required tables exist in database."""
    table_names = Base.metadata.tables.keys()
    assert "videos" in table_names
    assert "video_metadata" in table_names
    assert "transcripts" in table_names
    assert "patches" in table_names


def test_db_video_crud():
    """Test inserting and retrieving a Video record."""
    db = TestingSessionLocal()

    video_id = str(uuid.uuid4())
    video = Video(
        id=video_id,
        original_filename="sample.mp4",
        saved_filename=f"{video_id}.mp4",
        content_type="video/mp4",
        file_size=2048,
        status="uploaded",
    )
    db.add(video)
    db.commit()

    fetched = db.query(Video).filter(Video.id == video_id).first()
    assert fetched is not None
    assert fetched.original_filename == "sample.mp4"
    assert fetched.status == "uploaded"
    db.close()


# ─────────────────────────────────────────────
# Patch Analysis Tests
# ─────────────────────────────────────────────
def test_analyze_patch_nonexistent_video():
    """Test 404 returned for a video_id not in the database."""
    random_id = str(uuid.uuid4())
    response = client.post(
        f"/api/v1/videos/{random_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_analyze_patch_success_with_matches():
    """Test successful patch analysis with multiple occurrences in transcript."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    _seed_transcript(db, video_id)
    db.close()

    response = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    assert response.status_code == 200

    data = response.json()
    assert data["video_id"] == video_id
    assert data["status"] == "analyzed"
    assert data["occurrences_count"] == 3
    assert "transcript" in data["affected_assets"]
    assert len(data["diffs"]) == 3
    assert data["confidence_score"] > 0.0
    assert data["version"] is not None
    assert "patch_id" in data

    # Verify each diff has expected structure
    for diff in data["diffs"]:
        assert "GPT-4" in diff["original"]
        assert "GPT-5" in diff["patched"]
        assert diff["asset_type"] == "transcript"
        assert diff["target"] == "GPT-4"
        assert diff["replacement"] == "GPT-5"


def test_analyze_patch_no_matches():
    """Test patch analysis when no occurrences found in transcript."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    _seed_transcript(db, video_id)
    db.close()

    response = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace Claude with Gemini"},
    )
    assert response.status_code == 200

    data = response.json()
    assert data["occurrences_count"] == 0
    assert data["diffs"] == []
    assert data["confidence_score"] == 0.0
    assert len(data["warnings"]) > 0


def test_analyze_patch_no_transcript():
    """Test patch analysis with no transcript record returns analyzed with zero matches."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()  # No transcript seeded

    response = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["occurrences_count"] == 0


def test_list_patches_empty():
    """Test listing patches for a video with no patches returns empty list."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    response = client.get(f"/api/v1/videos/{video_id}/patches")
    assert response.status_code == 200
    data = response.json()
    assert data["video_id"] == video_id
    assert data["total"] == 0
    assert data["patches"] == []


def test_list_patches_after_analysis():
    """Test listing patches after multiple analyses returns all proposals."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    _seed_transcript(db, video_id)
    db.close()

    client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with Claude"},
    )

    response = client.get(f"/api/v1/videos/{video_id}/patches")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert data["patches"][0]["version"] == "v1.1"
    assert data["patches"][1]["version"] == "v1.2"


def test_get_patch_by_id():
    """Test retrieving a specific patch by patch_id."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    _seed_transcript(db, video_id)
    db.close()

    create_resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Replace GPT-4 with GPT-5"},
    )
    patch_id = create_resp.json()["patch_id"]

    get_resp = client.get(f"/api/v1/videos/patches/{patch_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["patch_id"] == patch_id
    assert get_resp.json()["video_id"] == video_id


def test_get_patch_nonexistent():
    """Test 404 for a nonexistent patch_id."""
    response = client.get(f"/api/v1/videos/patches/{uuid.uuid4()}")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


# ─────────────────────────────────────────────
# Backward Compatibility Tests
# ─────────────────────────────────────────────
def test_health_check_still_works():
    """Verify Sprint 1 health endpoint still works."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root_still_works():
    """Verify Sprint 1 root endpoint still works."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "PatchFlow API"
