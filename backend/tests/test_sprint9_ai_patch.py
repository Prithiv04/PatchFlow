import json
import uuid
import pytest
from fastapi.testclient import TestClient

from app.db.models import Transcript, Video
from app.main import app
from app.services.ai_patch_service import AIPatchService
from app.services.semantic_matcher import SemanticMatcher
from tests.conftest import TestingSessionLocal

client = TestClient(app)


def _seed_video_and_transcript(db, video_id: str, segments=None):
    video = Video(
        id=video_id,
        original_filename="sprint9_demo.mp4",
        saved_filename=f"{video_id}.mp4",
        content_type="video/mp4",
        file_size=1024,
        status="uploaded",
    )
    db.add(video)

    if segments is None:
        segments = [
            {"id": 0, "start": 0.0, "end": 3.0, "text": "Welcome to PatchFlow video editing."},
            {"id": 1, "start": 3.0, "end": 6.0, "text": "In Q3 2025, we released our initial beta."},
            {"id": 2, "start": 6.0, "end": 9.0, "text": "By Q3 of 2025, performance improved by 50%."},
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


def test_ai_patch_service_intent_parser():
    """Test AI Patch Service natural language prompt parsing."""
    intent1 = AIPatchService.parse_intent('Replace "PatchFlow" with "PatchFlow AI"')
    assert intent1.target == "PatchFlow"
    assert intent1.replacement == "PatchFlow AI"
    assert intent1.confidence >= 0.95

    intent2 = AIPatchService.parse_intent('Change the quarterly reference from Q3 2025 to Q4 2025')
    assert intent2.target == "Q3 2025"
    assert intent2.replacement == "Q4 2025"

    intent3 = AIPatchService.parse_intent('Update $19/mo to $29/mo')
    assert intent3.target == "$19/mo"
    assert intent3.replacement == "$29/mo"


def test_semantic_matcher_exact_and_fuzzy():
    """Test Semantic Matcher finds exact and fuzzy segment candidates."""
    segments = [
        {"id": 0, "start": 0.0, "end": 3.0, "text": "Welcome to PatchFlow video editing."},
        {"id": 1, "start": 3.0, "end": 6.0, "text": "In Q3 2025, we released our initial beta."},
    ]

    # Exact match
    candidates = SemanticMatcher.find_matches("PatchFlow", "PatchFlow AI", segments)
    assert len(candidates) == 1
    assert candidates[0]["is_exact"] is True
    assert candidates[0]["score"] == 1.0

    # Fuzzy match
    candidates_fuzzy = SemanticMatcher.find_matches("Q3 2025", "Q4 2025", segments)
    assert len(candidates_fuzzy) >= 1


def test_analyze_patch_exact_match():
    """Test analyze patch endpoint with exact match instruction."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": 'Replace "PatchFlow" with "PatchFlow AI"'},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["occurrences_count"] == 1
    assert data["confidence_score"] == 1.0
    assert data["parsed_target"] == "PatchFlow"
    assert data["parsed_replacement"] == "PatchFlow AI"
    assert len(data["candidate_segments"]) == 1


def test_analyze_patch_natural_language_instruction():
    """Test analyze patch endpoint with natural language instruction."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": "Update all date references from Q3 2025 to Q4 2025"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["occurrences_count"] >= 1
    assert data["parsed_target"] == "Q3 2025"
    assert data["parsed_replacement"] == "Q4 2025"


def test_analyze_patch_no_match():
    """Test analyze patch when target phrase does not exist."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video_and_transcript(db, video_id)
    db.close()

    resp = client.post(
        f"/api/v1/videos/{video_id}/patches/analyze",
        json={"prompt": 'Replace "GPT-4" with "GPT-5"'},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["occurrences_count"] == 0
    assert data["confidence_score"] == 0.0
    assert data["diffs"] == []
