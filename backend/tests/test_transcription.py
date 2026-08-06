import uuid
from pathlib import Path
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.config import settings

client = TestClient(app)


@pytest.fixture
def mock_uploaded_video(tmp_path):
    """Fixture creating a dummy video file in the configured upload directory."""
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    video_id = str(uuid.uuid4())
    video_file = settings.upload_path / f"{video_id}.mp4"
    video_file.write_bytes(b"\x00\x00\x00\x1cftypisom\x00\x00\x02\x00isomiso2avc1mp41")
    
    yield video_id, video_file

    # Cleanup artifacts after test
    for file_path in [
        video_file,
        settings.thumbnail_path / f"{video_id}.jpg",
        settings.audio_path / f"{video_id}.wav",
        settings.transcript_path / f"{video_id}.json",
        settings.caption_path / f"{video_id}.srt",
    ]:
        if file_path.exists():
            file_path.unlink()


def test_transcribe_nonexistent_video():
    """Test transcribing a nonexistent video returns 404."""
    random_id = str(uuid.uuid4())
    response = client.post(f"/api/v1/videos/{random_id}/transcribe")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


@patch("app.services.processing_service.extract_video_metadata")
@patch("app.services.processing_service.generate_thumbnail")
@patch("app.services.processing_service.extract_audio")
def test_get_metadata_endpoint(mock_extract_audio, mock_gen_thumb, mock_extract_meta, mock_uploaded_video):
    """Test GET /api/v1/videos/{video_id}/metadata endpoint."""
    video_id, _ = mock_uploaded_video

    mock_extract_meta.return_value = {
        "duration": 10.0,
        "width": 1920,
        "height": 1080,
        "fps": 30.0,
        "video_codec": "h264",
        "audio_codec": "aac",
        "audio_channels": 2,
        "bitrate": 4000000,
        "file_size": 100000,
        "container": "mp4"
    }

    response = client.get(f"/api/v1/videos/{video_id}/metadata")
    assert response.status_code == 200

    data = response.json()
    assert data["video_id"] == video_id
    assert data["audio_file"] == f"audio/{video_id}.wav"
    assert data["resolution"] == "1920x1080"


@patch("app.services.transcription_service.extract_audio")
@patch("app.services.transcription_service.transcribe_audio_file")
def test_transcribe_video_success(mock_transcribe, mock_extract_audio, mock_uploaded_video):
    """Test successful POST /api/v1/videos/{video_id}/transcribe execution."""
    video_id, _ = mock_uploaded_video

    def side_effect_extract_audio(video_path, audio_dest):
        audio_dest.parent.mkdir(parents=True, exist_ok=True)
        audio_dest.write_bytes(b"RIFF_MOCK_WAV_DATA")
        return audio_dest

    mock_extract_audio.side_effect = side_effect_extract_audio
    mock_transcribe.return_value = {
        "language": "en",
        "full_text": "Hello world welcome to PatchFlow.",
        "segments": [
            {"id": 0, "start": 0.0, "end": 2.0, "text": "Hello world"},
            {"id": 1, "start": 2.0, "end": 4.5, "text": "welcome to PatchFlow."}
        ]
    }

    response = client.post(f"/api/v1/videos/{video_id}/transcribe")
    assert response.status_code == 200

    data = response.json()
    assert data["video_id"] == video_id
    assert data["status"] == "completed"
    assert data["language"] == "en"
    assert "Hello world" in data["full_text"]
    assert len(data["segments"]) == 2
    assert data["transcript_file"] == f"transcripts/{video_id}.json"
    assert data["caption_file"] == f"captions/{video_id}.srt"

    # Check generated files exist on disk
    assert (settings.transcript_path / f"{video_id}.json").exists()
    assert (settings.caption_path / f"{video_id}.srt").exists()


@patch("app.services.transcription_service.extract_audio")
@patch("app.services.transcription_service.transcribe_audio_file")
def test_get_transcript_endpoint(mock_transcribe, mock_extract_audio, mock_uploaded_video):
    """Test GET /api/v1/videos/{video_id}/transcript retrieves stored JSON transcript."""
    video_id, _ = mock_uploaded_video

    mock_transcribe.return_value = {
        "language": "en",
        "full_text": "Sample transcript content.",
        "segments": [{"id": 0, "start": 0.0, "end": 1.5, "text": "Sample transcript content."}]
    }

    # First call transcribes and saves
    client.post(f"/api/v1/videos/{video_id}/transcribe")

    # Second call gets transcript from disk
    response = client.get(f"/api/v1/videos/{video_id}/transcript")
    assert response.status_code == 200
    data = response.json()
    assert data["video_id"] == video_id
    assert "Sample transcript content." in data["full_text"]


@patch("app.services.transcription_service.extract_audio")
@patch("app.services.transcription_service.transcribe_audio_file")
def test_get_captions_endpoint(mock_transcribe, mock_extract_audio, mock_uploaded_video):
    """Test GET /api/v1/videos/{video_id}/captions downloads .srt caption file."""
    video_id, _ = mock_uploaded_video

    mock_transcribe.return_value = {
        "language": "en",
        "full_text": "First caption line.",
        "segments": [{"id": 0, "start": 1.0, "end": 3.5, "text": "First caption line."}]
    }

    client.post(f"/api/v1/videos/{video_id}/transcribe")

    response = client.get(f"/api/v1/videos/{video_id}/captions")
    assert response.status_code == 200
    assert "00:00:01,000 --> 00:00:03,500" in response.text
    assert "First caption line." in response.text
