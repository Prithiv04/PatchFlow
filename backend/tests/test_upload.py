import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_uploads():
    """Ensure upload directory is clean before and after each test."""
    yield
    upload_path = settings.upload_path
    if upload_path.exists():
        for file in upload_path.iterdir():
            if file.is_file():
                try:
                    file.unlink()
                except Exception:
                    pass

def test_successful_video_upload():
    fake_video_content = b"fake video bytes header" * 100
    files = {
        "file": ("demo_video.mp4", io.BytesIO(fake_video_content), "video/mp4")
    }

    response = client.post("/api/v1/videos/upload", files=files)

    assert response.status_code == 201
    data = response.json()

    assert "video_id" in data
    assert data["original_filename"] == "demo_video.mp4"
    assert data["saved_filename"].endswith(".mp4")
    assert data["saved_filename"].startswith(data["video_id"])
    assert data["content_type"] == "video/mp4"
    assert data["file_size"] == len(fake_video_content)
    assert data["upload_timestamp"].endswith("Z")

    # Verify physical file saved on disk
    saved_file_path = settings.upload_path / data["saved_filename"]
    assert saved_file_path.exists()
    assert saved_file_path.stat().st_size == len(fake_video_content)

def test_unsupported_file_extension():
    fake_doc_content = b"Some plain text document"
    files = {
        "file": ("script.txt", io.BytesIO(fake_doc_content), "text/plain")
    }

    response = client.post("/api/v1/videos/upload", files=files)

    assert response.status_code == 400
    data = response.json()
    assert "Unsupported file extension" in data["detail"]

def test_unsupported_content_type():
    fake_video_content = b"fake video bytes"
    files = {
        "file": ("sample.mp4", io.BytesIO(fake_video_content), "application/pdf")
    }

    response = client.post("/api/v1/videos/upload", files=files)

    assert response.status_code == 400
    data = response.json()
    assert "Unsupported content-type" in data["detail"]

def test_empty_file_upload():
    empty_content = b""
    files = {
        "file": ("empty.mov", io.BytesIO(empty_content), "video/quicktime")
    }

    response = client.post("/api/v1/videos/upload", files=files)

    assert response.status_code == 400
    data = response.json()
    assert "empty" in data["detail"].lower()

def test_oversized_file_upload(monkeypatch):
    # Temporarily set max_upload_size_mb to 0.0001 MB (~100 bytes)
    monkeypatch.setattr(settings, "max_upload_size_mb", 1)
    # 2 MB payload to trigger size limit
    oversized_content = b"X" * (2 * 1024 * 1024)
    files = {
        "file": ("large_video.mkv", io.BytesIO(oversized_content), "video/x-matroska")
    }

    response = client.post("/api/v1/videos/upload", files=files)

    assert response.status_code == 413
    data = response.json()
    assert "exceeds maximum allowed size" in data["detail"]
