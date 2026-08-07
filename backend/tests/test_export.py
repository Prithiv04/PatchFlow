"""
Backend Sprint 7 tests — Asset Export, Download & Packaging.
"""
import io
import json
import uuid
import zipfile

import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.db.models import Patch, Transcript, Video
from app.main import app
from tests.conftest import TestingSessionLocal

client = TestClient(app)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _seed_video(db, video_id: str) -> Video:
    video = Video(
        id=video_id,
        original_filename="demo.mp4",
        saved_filename=f"{video_id}.mp4",
        content_type="video/mp4",
        file_size=2048,
        status="processed",
    )
    db.add(video)
    db.commit()
    return video


def _seed_transcript(db, video_id: str) -> Transcript:
    transcript = Transcript(
        video_id=video_id,
        language="en",
        full_text="Hello world.",
        segments_json=json.dumps([{"id": 0, "start": 0.0, "end": 1.5, "text": "Hello world."}]),
        transcript_path=str(settings.transcript_path / f"{video_id}.json"),
        caption_path=str(settings.caption_path / f"{video_id}.srt"),
    )
    db.add(transcript)
    db.commit()
    return transcript


def _seed_patch(db, video_id: str, patch_status: str = "applied") -> Patch:
    patch_id = str(uuid.uuid4())
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    patch = Patch(
        id=patch_id,
        video_id=video_id,
        prompt="Replace GPT-4 with GPT-5",
        status=patch_status,
        occurrences_count=2,
        affected_assets_json='["transcript", "captions"]',
        diffs_json='[{"target": "GPT-4", "replacement": "GPT-5"}]',
        confidence_score=0.95,
        warnings_json="[]",
        version="v1.1",
        created_at=now,
        applied_at=now if patch_status == "applied" else None,
    )
    db.add(patch)
    db.commit()
    return patch


def _write_temp_file(path, content: bytes = b"fake content"):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    return path


@pytest.fixture(autouse=True)
def cleanup_temp_files():
    """Clean up any test asset files after each test."""
    yield
    for directory in [
        settings.upload_path,
        settings.transcript_path,
        settings.caption_path,
        settings.audio_path,
        settings.thumbnail_path,
    ]:
        if directory.exists():
            for f in directory.iterdir():
                if f.is_file() and f.name != ".gitkeep":
                    try:
                        f.unlink()
                    except Exception:
                        pass


# ─── Video Download Tests ──────────────────────────────────────────────────────

def test_download_video_success():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    video_file = settings.upload_path / f"{video_id}.mp4"
    _write_temp_file(video_file, b"fake mp4 bytes")

    response = client.get(f"/api/v1/videos/{video_id}/download/video")
    assert response.status_code == 200
    assert "video/" in response.headers["content-type"]
    assert "attachment" in response.headers.get("content-disposition", "")


def test_download_video_not_found_in_db():
    response = client.get(f"/api/v1/videos/{uuid.uuid4()}/download/video")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_download_video_file_missing_on_disk():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    # Do NOT create the file — expect 404
    response = client.get(f"/api/v1/videos/{video_id}/download/video")
    assert response.status_code == 404


# ─── Transcript Download Tests ─────────────────────────────────────────────────

def test_download_transcript_success():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    _seed_transcript(db, video_id)
    db.close()

    transcript_file = settings.transcript_path / f"{video_id}.json"
    _write_temp_file(transcript_file, json.dumps({"full_text": "Hello world."}).encode())

    response = client.get(f"/api/v1/videos/{video_id}/download/transcript")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    assert "attachment" in response.headers.get("content-disposition", "")
    assert "_transcript" in response.headers.get("content-disposition", "")


def test_download_transcript_file_missing():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    response = client.get(f"/api/v1/videos/{video_id}/download/transcript")
    assert response.status_code == 404


# ─── Captions Download Tests ───────────────────────────────────────────────────

def test_download_captions_success():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    caption_file = settings.caption_path / f"{video_id}.srt"
    _write_temp_file(caption_file, b"1\n00:00:00,000 --> 00:00:01,500\nHello world.\n")

    response = client.get(f"/api/v1/videos/{video_id}/download/captions")
    assert response.status_code == 200
    assert "text/plain" in response.headers["content-type"]
    assert "_captions" in response.headers.get("content-disposition", "")


def test_download_captions_file_missing():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    response = client.get(f"/api/v1/videos/{video_id}/download/captions")
    assert response.status_code == 404


# ─── Audio Download Tests ──────────────────────────────────────────────────────

def test_download_audio_success():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    audio_file = settings.audio_path / f"{video_id}.wav"
    _write_temp_file(audio_file, b"RIFF fake wav bytes")

    response = client.get(f"/api/v1/videos/{video_id}/download/audio")
    assert response.status_code == 200
    assert "audio/wav" in response.headers["content-type"]
    assert "_audio" in response.headers.get("content-disposition", "")


def test_download_audio_file_missing():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    response = client.get(f"/api/v1/videos/{video_id}/download/audio")
    assert response.status_code == 404


# ─── Thumbnail Download Tests ──────────────────────────────────────────────────

def test_download_thumbnail_success():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    thumb_file = settings.thumbnail_path / f"{video_id}.jpg"
    _write_temp_file(thumb_file, b"\xff\xd8\xff fake jpeg bytes")

    response = client.get(f"/api/v1/videos/{video_id}/download/thumbnail")
    assert response.status_code == 200
    assert "image/jpeg" in response.headers["content-type"]
    assert "_thumbnail" in response.headers.get("content-disposition", "")


def test_download_thumbnail_file_missing():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    response = client.get(f"/api/v1/videos/{video_id}/download/thumbnail")
    assert response.status_code == 404


# ─── Patch Report Download Tests ───────────────────────────────────────────────

def test_download_patch_report_success():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    patch = _seed_patch(db, video_id, patch_status="applied")
    patch_id = patch.id  # read before session closes to avoid DetachedInstanceError
    db.close()

    response = client.get(f"/api/v1/videos/{video_id}/patches/{patch_id}/download/report")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    assert "attachment" in response.headers.get("content-disposition", "")
    assert f"report_{patch_id}.json" in response.headers.get("content-disposition", "")

    data = response.json()
    assert data["video_id"] == video_id
    assert data["patch_id"] == patch_id
    assert data["status"] == "applied"
    assert data["version"] == "v1.1"
    assert "export_timestamp" in data
    assert "diffs" in data
    assert "confidence_score" in data


def test_download_patch_report_not_found():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    response = client.get(f"/api/v1/videos/{video_id}/patches/{uuid.uuid4()}/download/report")
    assert response.status_code == 404


def test_download_patch_report_invalid_video():
    response = client.get(f"/api/v1/videos/{uuid.uuid4()}/patches/{uuid.uuid4()}/download/report")
    assert response.status_code == 404


# ─── Package (ZIP) Download Tests ─────────────────────────────────────────────

def test_download_package_success():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    _seed_patch(db, video_id, patch_status="applied")
    db.close()

    # Write all asset files
    _write_temp_file(settings.upload_path / f"{video_id}.mp4", b"fake mp4")
    _write_temp_file(settings.transcript_path / f"{video_id}.json", b'{"full_text":"Hello"}')
    _write_temp_file(settings.caption_path / f"{video_id}.srt", b"1\n00:00:00,000 --> 00:00:01,500\nHello\n")
    _write_temp_file(settings.audio_path / f"{video_id}.wav", b"RIFF fake")
    _write_temp_file(settings.thumbnail_path / f"{video_id}.jpg", b"\xff\xd8 fake")

    response = client.get(f"/api/v1/videos/{video_id}/download/package")
    assert response.status_code == 200
    assert "application/zip" in response.headers["content-type"]
    assert "_package.zip" in response.headers.get("content-disposition", "")

    # Validate ZIP contents
    zip_buf = io.BytesIO(response.content)
    with zipfile.ZipFile(zip_buf, "r") as zf:
        names = zf.namelist()
    assert any(".mp4" in n for n in names)
    assert any("_transcript.json" in n for n in names)
    assert any("_captions.srt" in n for n in names)
    assert any("_audio.wav" in n for n in names)
    assert any("_thumbnail.jpg" in n for n in names)
    assert any("report_" in n for n in names)


def test_download_package_partial_assets():
    """ZIP is still returned when only some assets exist."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    # Only transcript + captions on disk
    _write_temp_file(settings.transcript_path / f"{video_id}.json", b'{"full_text":"Hello"}')
    _write_temp_file(settings.caption_path / f"{video_id}.srt", b"1\n00:00:00,000 --> 00:00:01,500\nHello\n")

    response = client.get(f"/api/v1/videos/{video_id}/download/package")
    assert response.status_code == 200
    zip_buf = io.BytesIO(response.content)
    with zipfile.ZipFile(zip_buf, "r") as zf:
        names = zf.namelist()
    assert any("_transcript.json" in n for n in names)
    assert any("_captions.srt" in n for n in names)
    assert not any(".mp4" in n for n in names)


def test_download_package_no_assets():
    """Returns 404 when video has no assets at all."""
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    response = client.get(f"/api/v1/videos/{video_id}/download/package")
    assert response.status_code == 404


def test_download_package_invalid_video():
    response = client.get(f"/api/v1/videos/{uuid.uuid4()}/download/package")
    assert response.status_code == 404


# ─── Content-Disposition Header Tests ─────────────────────────────────────────

def test_content_disposition_header_transcript():
    db = TestingSessionLocal()
    video_id = str(uuid.uuid4())
    _seed_video(db, video_id)
    db.close()

    _write_temp_file(settings.transcript_path / f"{video_id}.json", b"{}")
    response = client.get(f"/api/v1/videos/{video_id}/download/transcript")
    disposition = response.headers.get("content-disposition", "")
    assert "attachment" in disposition
    assert ".json" in disposition
