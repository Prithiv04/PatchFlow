import uuid
from pathlib import Path
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.config import settings

client = TestClient(app)


@pytest.fixture
def mock_upload_file(tmp_path):
    """Fixture creating a dummy video file in the configured upload directory."""
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    video_id = str(uuid.uuid4())
    video_file = settings.upload_path / f"{video_id}.mp4"
    video_file.write_bytes(b"\x00\x00\x00\x1cftypisom\x00\x00\x02\x00isomiso2avc1mp41")
    
    yield video_id, video_file

    # Cleanup video file if still exists
    if video_file.exists():
        video_file.unlink()

    # Cleanup thumbnail file if created
    thumb_file = settings.thumbnail_path / f"{video_id}.jpg"
    if thumb_file.exists():
        thumb_file.unlink()


def test_process_nonexistent_video():
    """Test processing a nonexistent video ID returns 404."""
    random_id = str(uuid.uuid4())
    response = client.post(f"/api/v1/videos/{random_id}/process")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


@patch("app.services.processing_service.extract_audio")
@patch("app.services.processing_service.extract_video_metadata")
@patch("app.services.processing_service.generate_thumbnail")
def test_process_valid_video_success(mock_gen_thumb, mock_extract_meta, mock_extract_audio, mock_upload_file):
    """Test successful video processing returning expected metadata and thumbnail path."""
    video_id, video_file = mock_upload_file

    mock_extract_meta.return_value = {
        "duration": 12.5,
        "width": 1920,
        "height": 1080,
        "fps": 29.97,
        "video_codec": "h264",
        "audio_codec": "aac",
        "audio_channels": 2,
        "bitrate": 5000000,
        "file_size": 102400,
        "container": "mov,mp4,m4a,3gp,3g2,mj2"
    }

    def side_effect_gen_thumb(v_path, output_path, timestamp):
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(b"JPEG_HEADER_MOCK_DATA")

    mock_gen_thumb.side_effect = side_effect_gen_thumb

    response = client.post(f"/api/v1/videos/{video_id}/process")
    assert response.status_code == 200

    data = response.json()
    assert data["video_id"] == video_id
    assert data["status"] == "processed"
    assert data["duration"] == 12.5
    assert data["width"] == 1920
    assert data["height"] == 1080
    assert data["fps"] == 29.97
    assert data["video_codec"] == "h264"
    assert data["audio_codec"] == "aac"
    assert data["bitrate"] == 5000000
    assert data["container"] == "mov,mp4,m4a,3gp,3g2,mj2"
    assert data["thumbnail"] == f"thumbnails/{video_id}.jpg"
    assert "processed_at" in data

    # Verify generated thumbnail exists
    thumb_path = settings.thumbnail_path / f"{video_id}.jpg"
    assert thumb_path.exists()
    assert thumb_path.read_bytes() == b"JPEG_HEADER_MOCK_DATA"


@patch("app.services.processing_service.extract_audio")
@patch("app.services.processing_service.extract_video_metadata")
@patch("app.services.processing_service.generate_thumbnail")
def test_process_short_video_thumbnail_timestamp(mock_gen_thumb, mock_extract_meta, mock_extract_audio, mock_upload_file):
    """Test short video (<5s) computes timestamp as duration / 2."""
    video_id, video_file = mock_upload_file

    mock_extract_meta.return_value = {
        "duration": 3.0,
        "width": 1280,
        "height": 720,
        "fps": 30.0,
        "video_codec": "h264",
        "audio_codec": None,
        "audio_channels": None,
        "bitrate": 2000000,
        "file_size": 50000,
        "container": "mp4"
    }

    client.post(f"/api/v1/videos/{video_id}/process")

    # Called with timestamp = 3.0 / 2 = 1.5
    mock_gen_thumb.assert_called_once()
    args, kwargs = mock_gen_thumb.call_args
    timestamp_arg = args[2] if len(args) > 2 else kwargs.get("timestamp")
    assert timestamp_arg == 1.5


@patch("app.services.processing_service.extract_video_metadata")
def test_process_metadata_extraction_failure(mock_extract_meta, mock_upload_file):
    """Test 500 response when FFprobe metadata extraction fails."""
    video_id, _ = mock_upload_file
    mock_extract_meta.side_effect = RuntimeError("FFprobe execution failed")

    response = client.post(f"/api/v1/videos/{video_id}/process")
    assert response.status_code == 500
    assert "extraction failed" in response.json()["detail"].lower()


@patch("app.services.processing_service.extract_audio")
@patch("app.services.processing_service.extract_video_metadata")
@patch("app.services.processing_service.generate_thumbnail")
def test_process_thumbnail_generation_failure(mock_gen_thumb, mock_extract_meta, mock_extract_audio, mock_upload_file):
    """Test 500 response when FFmpeg thumbnail generation fails."""
    video_id, _ = mock_upload_file
    mock_extract_meta.return_value = {
        "duration": 10.0,
        "width": 1920,
        "height": 1080,
        "fps": 30.0,
        "video_codec": "h264",
        "audio_codec": "aac",
        "audio_channels": 2,
        "bitrate": 3000000,
        "file_size": 80000,
        "container": "mp4"
    }
    mock_gen_thumb.side_effect = RuntimeError("FFmpeg thumbnail generation failed")

    response = client.post(f"/api/v1/videos/{video_id}/process")
    assert response.status_code == 500
    assert "thumbnail generation failed" in response.json()["detail"].lower()
