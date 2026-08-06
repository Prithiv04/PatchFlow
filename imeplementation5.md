PatchFlow – Backend Sprint 2: Video Upload API Implementation Plan
Overview

This sprint implements the first real backend feature for PatchFlow: a Video Upload API.

The goal is to replace the frontend's simulated upload workflow with a production-ready backend endpoint capable of receiving, validating, and storing uploaded video files.

This sprint focuses only on file uploads. No video processing, AI, transcription, database integration, or frontend modifications should be implemented.

Objectives

Implement a backend upload service that:

Accepts multipart video uploads.
Validates file type.
Validates maximum upload size.
Saves files to backend/uploads/.
Generates a unique video ID.
Returns upload metadata.
Provides clear API responses and error handling.
Includes automated tests.
Scope
Included
Video Upload API
File validation
Upload service
Upload schemas
Upload router
Upload tests
Swagger documentation
Explicitly Excluded

Do not implement:

Authentication
Database
FFmpeg
Whisper
AI processing
Background workers
Thumbnail generation
Frontend integration
Progress tracking
Version history

Those belong to later sprints.

Project Structure
backend/
│
├── app/
│   ├── api/
│   │   └── upload.py
│   │
│   ├── schemas/
│   │   └── upload.py
│   │
│   ├── services/
│   │   └── upload_service.py
│   │
│   ├── utils/
│   │   └── file_utils.py
│   │
│   └── main.py
│
├── uploads/
│
└── tests/
    └── test_upload.py
API Endpoint
POST /api/v1/videos/upload

Accepts:

multipart/form-data

Field:

file

Type:

UploadFile
Validation Rules

Supported formats only:

MP4
MOV
AVI
MKV

Reject:

TXT
PDF
ZIP
EXE
Unsupported MIME types

Implement a configurable maximum upload size.

Return appropriate HTTP status codes and descriptive error messages for invalid uploads.

Upload Service

Create a dedicated upload service responsible for:

validating uploaded files
generating a UUID
sanitizing filenames
preserving file extensions
saving files into
backend/uploads/

No business logic should exist inside the route itself.

Response Schema

Successful upload returns:

{
  "video_id": "...",
  "original_filename": "...",
  "saved_filename": "...",
  "content_type": "...",
  "file_size": 123456,
  "upload_timestamp": "..."
}

Use Pydantic response models.

Error Handling

Return appropriate HTTP errors for:

unsupported file type
empty upload
oversized file
save failure
unexpected server errors

Provide consistent JSON error responses.

Main Application

Update app/main.py to register the upload router.

The existing endpoints must continue to work:

GET /
GET /health

No breaking changes.

Testing

Create automated tests using TestClient.

Cover:

successful upload
unsupported extension
invalid content type
oversized upload
endpoint returns expected JSON
uploaded file exists in backend/uploads

All tests should pass with:

python -m pytest -q
Swagger Verification

Verify:

Upload endpoint appears in /docs
File picker is available
Upload succeeds
Metadata response is correct
Invalid uploads return proper errors
Manual Verification

Verify the following:

FastAPI starts successfully.
Existing endpoints continue working.
Upload endpoint accepts valid videos.
Uploaded file is saved correctly.
UUID is generated.
Metadata is returned.
Invalid files are rejected.
Tests pass.
Frontend remains unchanged.
Deliverables
Upload router
Upload service
Upload schemas
File utility module
Automated tests
Updated Swagger documentation
Acceptance Criteria
Backend builds successfully.
All tests pass.
Swagger upload works.
Files are stored correctly.
UUIDs are generated.
Proper validation is enforced.
No frontend files are modified.
No FFmpeg, Whisper, AI, authentication, or database functionality is introduced.