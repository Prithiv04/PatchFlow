# Implementation Plan - Backend Sprint 7: Asset Export, Download & Packaging

Technical implementation plan for Backend Sprint 7, focusing on exporting and downloading processed assets generated throughout the PatchFlow pipeline.

IMPORTANT

No implementation code should be written until this implementation plan has been reviewed. This document contains only architecture, API design, responsibilities, testing strategy, and verification criteria.

---

## Objective

Implement a centralized asset export layer that allows clients to securely download all generated artifacts for a processed video.

The export system should support:

- Original uploaded video
- Extracted WAV audio
- Generated thumbnail
- Transcript JSON
- Subtitle (.srt)
- Patch report
- Complete ZIP package containing all assets

The implementation must reuse existing backend artifacts without regenerating files.

---

# High-Level Architecture

                    Video Assets
                          │
                          ▼
              Database + File Storage
                          │
                          ▼
               Export Service Layer
                          │
      ┌───────────┬────────────┬─────────────┐
      ▼           ▼            ▼
 Single Asset  Patch Report   ZIP Package
 Download      Export         Export
      │           │            │
      └───────────┴────────────┘
                  │
                  ▼
         FastAPI Download Endpoints

---

# Existing Backend Review

Review the existing backend implementation completed through Sprint 6.

Verify:

- Upload pipeline
- Processing pipeline
- Transcription pipeline
- Patch analysis
- Patch execution
- Patch reports
- Version history
- Existing database models
- Current file storage layout

No existing functionality should be modified unless required for Sprint 7.

Maintain full backward compatibility.

---

# File-by-File Implementation Plan

## backend/app/api/v1/export.py (NEW)

Create export endpoints.

Responsibilities:

- Download transcript
- Download captions
- Download audio
- Download thumbnail
- Download original video
- Download patch report
- Download ZIP archive

---

## backend/app/services/export_service.py (NEW)

Business logic for:

- locating generated assets
- validating existence
- generating downloadable filenames
- streaming files
- building ZIP archives
- exporting reports

---

## backend/app/utils/export_utils.py (NEW)

Utility functions:

- MIME type detection
- ZIP archive generation
- temporary file cleanup
- file validation
- safe filename generation

---

## backend/app/schemas/export.py (NEW)

Pydantic models:

DownloadAssetResponse

ExportPackageResponse

ExportReportResponse

AssetMetadata

---

## backend/app/main.py

Register export router.

No breaking changes.

---

# API Endpoints

## Download Original Video

GET

/api/v1/videos/{video_id}/download/video

Returns:

- original mp4

---

## Download Transcript

GET

/api/v1/videos/{video_id}/download/transcript

Returns:

transcript JSON

---

## Download Captions

GET

/api/v1/videos/{video_id}/download/captions

Returns:

SRT file

---

## Download Audio

GET

/api/v1/videos/{video_id}/download/audio

Returns:

WAV file

---

## Download Thumbnail

GET

/api/v1/videos/{video_id}/download/thumbnail

Returns:

JPEG thumbnail

---

## Download Patch Report

GET

/api/v1/videos/{video_id}/patches/{patch_id}/download/report

Returns:

Generated report (JSON or PDF if supported)

---

## Download Complete Package

GET

/api/v1/videos/{video_id}/download/package

Creates ZIP containing:

Original video

Transcript

Caption

Audio

Thumbnail

Patch report

Returns ZIP archive.

---

# Service Responsibilities

ExportService should

- validate video exists
- validate requested asset exists
- return 404 for missing assets
- stream files efficiently
- avoid loading large files fully into memory
- create ZIP archives dynamically
- clean temporary files

---

# Error Handling

Handle:

404

Missing asset

404

Unknown video

400

Invalid export request

500

ZIP generation failure

500

Filesystem errors

---

# Security

Validate every requested path.

Prevent directory traversal.

Never expose filesystem paths.

Only allow exports belonging to the requested video.

---

# Testing Strategy

Create

backend/tests/test_export.py

Test:

Download video

Download transcript

Download captions

Download audio

Download thumbnail

Download report

Download ZIP

Missing file handling

Invalid video

Invalid asset

ZIP contents

Correct headers

Correct MIME types

---

# Backward Compatibility

No database migrations.

No ORM changes.

No API breaking changes.

Sprint 1–6 endpoints must continue working without modification.

---

# Verification Checklist

✔ Existing tests continue passing

✔ New export tests pass

✔ Download endpoints return correct files

✔ ZIP archive contains all expected assets

✔ Missing assets return proper HTTP errors

✔ Correct MIME types returned

✔ Streaming downloads function correctly

✔ Swagger documentation updated

✔ No regressions introduced

---

# Deliverables

- Export router
- Export service
- Export utilities
- Export schemas
- Download endpoints
- ZIP packaging
- Report export
- Automated tests
- Updated Swagger documentation
- Walkthrough documenting implementation and verification

Do not write implementation code until this implementation plan has been reviewed and approved.