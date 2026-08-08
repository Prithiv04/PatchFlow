Implementation Plan – Sprint 8: Frontend–Backend Integration & End-to-End Workflow
Overview

Sprint 8 transforms PatchFlow from a frontend prototype with simulated workflows into a fully functional end-to-end application.

The backend (Sprints 1–7) already provides production-ready APIs for upload, processing, transcription, patch analysis, patch application, reporting, history, and asset export.

This sprint focuses exclusively on connecting the existing React frontend to those APIs while preserving the current UI/UX and design system.

No backend business logic should be modified unless a small compatibility fix is required.

Objectives

Replace every mocked frontend action with real API communication.

Integrate:

Video Upload
Processing
Metadata
Transcription
Patch Analysis
Patch Apply
Patch History
Reports
Asset Downloads

Maintain the existing premium interface, animations, loading states, and responsiveness.

Technical Architecture
React Frontend
        │
        │ Axios / Fetch
        ▼
FastAPI Backend
        │
        ├── Upload API
        ├── Processing API
        ├── Metadata API
        ├── Transcript API
        ├── Patch APIs
        ├── Report API
        ├── History API
        └── Export APIs
Scope
1. API Client Layer

Create a centralized API service.

frontend/
└── src/
    └── services/
        ├── api.ts
        ├── uploadService.ts
        ├── processingService.ts
        ├── transcriptionService.ts
        ├── patchService.ts
        ├── reportService.ts
        └── exportService.ts

Responsibilities:

Base URL configuration
Axios instance
Error interceptors
Timeout configuration
Typed API methods
2. Environment Configuration

Add

.env
VITE_API_BASE_URL=http://127.0.0.1:8000

The frontend must never hardcode API URLs.

3. Global State Integration

Replace temporary Zustand mock state with backend-driven state.

Maintain:

currentVideoId
upload status
processing status
transcript
patches
reports
history
export state

Persist only required identifiers.

4. Upload Integration

Current

Simulated upload.

Replace with

POST /api/v1/videos/upload

Flow

User selects video

↓

Multipart upload

↓

Receive

video_id

↓

Store in Zustand

↓

Navigate automatically to Processing

5. Processing Integration

Replace simulated processing sequence.

Use

POST /api/v1/videos/{video_id}/process

Display real

duration
resolution
codec
thumbnail
audio generated

Use returned thumbnail instead of placeholder.

6. Metadata Integration

Use

GET /api/v1/videos/{video_id}/metadata

Populate

duration
fps
resolution
bitrate
codec

inside dashboard cards.

7. Transcription Integration

Replace fake transcript.

Use

POST /api/v1/videos/{video_id}/transcribe

Then

GET /api/v1/videos/{video_id}/transcript

Display

transcript text
timestamps
language
segments

Update transcript page dynamically.

8. Patch Analysis Integration

Replace fake generated patches.

Use

POST /patch/analyze

Display

confidence
proposed changes
assets
reasoning

Populate existing Patch UI.

9. Patch Apply Integration

Connect Apply button.

POST /patch/apply

Update

transcript
captions
report

Show success animation after response.

10. Version History

Populate History page from

GET /history

Display

version timeline
patch names
author
timestamps

Remove placeholder timeline.

11. Analytics Report

Connect Report page.

GET /report

Populate

confidence
processing time
assets changed
occurrence counts

Use backend values only.

12. Asset Downloads

Replace disabled buttons.

Connect

Download Video
Download Transcript
Download Captions
Download Audio
Download Thumbnail
Download Report
Download ZIP

Use browser download API.

13. Error Handling

Create reusable UI components.

Examples

Upload failed

Video not found

Backend unavailable

Processing failed

Transcription failed

Patch failed

Timeout

Network disconnected

Show user-friendly toast messages.

14. Loading States

Replace artificial timers.

Display loading while awaiting actual backend responses.

Examples

Uploading...

Processing...

Generating Transcript...

Analyzing Patch...

Applying Patch...

Preparing Download...

15. API Type Safety

Create TypeScript interfaces matching backend schemas.

types/

UploadResponse.ts

ProcessingResponse.ts

TranscriptResponse.ts

PatchResponse.ts

ReportResponse.ts

HistoryResponse.ts

Avoid using

any
16. File Preview

Display uploaded thumbnail returned from backend.

Preview

filename
duration
resolution
thumbnail

instead of mock preview.

17. End-to-End Workflow

After integration the complete flow becomes

Upload Video

↓

Process Video

↓

Generate Metadata

↓

Generate Transcript

↓

Analyze Patch

↓

Apply Patch

↓

Generate Report

↓

View History

↓

Download Assets

Every step should use live backend APIs.

File Structure
frontend/

src/

├── services/

│   ├── api.ts

│   ├── uploadService.ts

│   ├── processingService.ts

│   ├── transcriptionService.ts

│   ├── patchService.ts

│   ├── reportService.ts

│   └── exportService.ts

│

├── hooks/

│   ├── useUpload.ts

│   ├── useProcessing.ts

│   ├── useTranscript.ts

│   └── usePatch.ts

│

├── types/

│   ├── upload.ts

│   ├── processing.ts

│   ├── transcript.ts

│   ├── patch.ts

│   ├── report.ts

│   └── history.ts
Verification Plan
Manual Testing

Verify complete workflow:

Upload video
Process video
Generate thumbnail
Generate transcript
Analyze patch
Apply patch
View report
View history
Download ZIP
Download transcript
Download captions

No simulated data should remain.

Backend Verification

Confirm frontend communicates with

Upload API
Process API
Metadata API
Transcript API
Patch APIs
Report API
History API
Export APIs
UI Verification

Ensure:

Existing animations remain
Existing premium design remains
Responsive layout unchanged
Navigation unchanged
Loading indicators use real backend progress
Toast notifications display success/failure correctly
Success Criteria

Sprint 8 is considered complete when:

All frontend pages use live backend APIs.
No mock data or simulated workflows remain.
Upload → Process → Transcribe → Analyze → Apply → Report → History → Export works end-to-end.
Existing UI/UX is preserved.
Both frontend and backend run together without breaking previous functionality.
All backend endpoints are exercised successfully through the frontend.
The application functions as a complete, integrated PatchFlow system.