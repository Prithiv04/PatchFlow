Backend Sprint 3 – Video Processing (FFmpeg)
Objective

Implement the video processing foundation for PatchFlow.

This sprint begins processing uploaded videos but does not introduce AI, transcription, databases, authentication, or frontend changes.

The goal is to build a clean media-processing layer that later sprints can reuse.

Scope

Implement only:

FFmpeg integration
Video metadata extraction
Audio extraction
Processing service
Processing API
Tests

Do not implement:

Whisper
Faster-Whisper
AI
Patch generation
Database
Authentication
Celery
Redis
Background workers
Frontend modifications
Project Structure
backend/

app/

api/
v1/
processing.py

services/
processing_service.py

schemas/
processing.py

utils/
ffmpeg_utils.py

audio/
.gitkeep

uploads/

tests/
test_processing.py

The existing upload pipeline must remain unchanged.

FFmpeg Integration

Use FFmpeg locally.

Create helper functions for:

checking FFmpeg availability
extracting metadata
extracting audio

Use subprocess safely.

Do not use shell=True.

Raise proper HTTP exceptions if FFmpeg is missing.

Metadata Extraction

Given a video ID:

Locate

uploads/<video_id>.mp4

(or its original extension)

Extract:

duration
width
height
fps
codec
bitrate
audio codec

Return structured JSON.

Audio Extraction

Extract audio into

backend/audio/

Filename:

<video_id>.wav

Requirements:

PCM WAV
mono
16kHz

Use FFmpeg.

If extraction fails:

clean partial files
return proper error
API Endpoints
POST
/api/v1/videos/{video_id}/process

Process uploaded video.

Steps:

verify uploaded file exists
extract metadata
extract audio
return processing summary

Return HTTP 200.

GET
/api/v1/videos/{video_id}/metadata

Return extracted metadata.

Response Model

Create ProcessingResponse

Include:

video_id

audio_file

duration

resolution

fps

codec

processing_timestamp

status
Logging

Use existing logging module.

Log:

processing started
metadata extracted
audio extraction completed
processing failed
Error Handling

Return proper HTTP status codes.

404

video not found

400

invalid processing request

500

FFmpeg processing failure

Do not expose raw stack traces.

Testing

Create

tests/test_processing.py

Cover:

✅ metadata extraction

✅ audio extraction

✅ missing file

✅ invalid video

✅ processing endpoint

✅ metadata endpoint

Clean generated audio after each test.

Verification

The implementation is complete only if all of these succeed.

python -m pytest -q

All tests pass.

uvicorn app.main:app --reload

Server starts successfully.

Swagger displays

POST /api/v1/videos/{video_id}/process

GET /api/v1/videos/{video_id}/metadata

Upload a sample video using the existing upload API.

Run processing.

Verify:

audio appears inside
backend/audio/
metadata is returned correctly
frontend remains completely unchanged
existing upload API still works
all previous tests continue passing.