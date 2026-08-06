Read the existing project and continue implementing the frontend only.

Do NOT generate another implementation plan.
Do NOT create placeholder pages.
Do NOT change the existing design system.
Implement production-quality code only.

# Goal

Build the complete Create Patch workflow for PatchFlow.

This is still a frontend-only implementation using mock data. No backend APIs, FastAPI, database, or AI models should be used.

The implementation must match the existing premium SaaS UI (Linear + Vercel + Supabase aesthetic) with dark theme, glassmorphism, Inter font, Framer Motion animations, shadcn/ui components, Tailwind CSS, and Zustand state.

----------------------------------------------------
USER FLOW
----------------------------------------------------

Dashboard
↓

Import Video

↓

Processing

↓

Video Details

↓

Create Patch

↓

Patch Preview

↓

Apply Patch

↓

Version History

↓

Patch Report

----------------------------------------------------
1. CREATE PATCH PAGE
----------------------------------------------------

Create src/pages/CreatePatchPage.tsx

Requirements:

• Large prompt editor

Example placeholder:

"Replace every occurrence of GPT-4 with GPT-5."

• Command templates

- Replace Product Name
- Update Sponsor
- Replace Affiliate Link
- Correct Pricing
- Update Statistics
- Update Company Name
- Correct Dates

Clicking a template fills the editor.

Show detected assets:

✓ Transcript
✓ Captions (.srt)
✓ Description
✓ Pinned Comment

Display the current video information loaded from Zustand.

Buttons:

Analyze Patch
Cancel

Animations:

- Fade in
- Card hover
- Button hover
- Prompt textarea focus animation

----------------------------------------------------
2. PATCH PREVIEW PAGE
----------------------------------------------------

Create src/pages/PatchPreviewPage.tsx

Simulate AI analysis using mock data.

Show a professional diff viewer.

Example:

Transcript

- GPT-4
+ GPT-5

Description

- Built using GPT-4
+ Built using GPT-5

Pinned Comment

- GPT-4 tutorial
+ GPT-5 tutorial

Also show:

Affected Assets

Transcript

Captions

Description

Pinned Comment

Summary cards

Assets affected

Occurrences

Confidence

Estimated processing time

Warnings section

Example:

"This patch changes text only.
Audio and video frames remain unchanged."

Buttons

Back

Apply Patch

----------------------------------------------------
3. APPLY PATCH PAGE
----------------------------------------------------

Create src/pages/ApplyPatchPage.tsx

Show a progress interface.

Stages

Applying Transcript

Updating Captions

Updating Description

Updating Pinned Comment

Saving Version

Generating Report

Each stage should animate sequentially.

Progress bar

Status indicator

After completion

Automatically navigate to Version History.

----------------------------------------------------
4. VERSION HISTORY PAGE
----------------------------------------------------

Create src/pages/HistoryPage.tsx

Timeline UI.

Example

v1.0

Original Upload

↓

Patch #1

GPT-4 → GPT-5

↓

v1.1

↓

Patch #2

Pricing Update

↓

v1.2

Each version card shows

Version

Date

Author

Patch summary

Ability to click and view version details.

----------------------------------------------------
5. PATCH REPORT PAGE
----------------------------------------------------

Create src/pages/ReportPage.tsx

Professional analytics layout.

Summary cards

Assets Updated

Occurrences Changed

Processing Time

Patch Success

Detailed report table

Transcript

Captions

Description

Pinned Comment

Version

Status

Export buttons

Export JSON

Export PDF (mock)

Download Patch Report

----------------------------------------------------
STATE MANAGEMENT
----------------------------------------------------

Use Zustand.

Store

Current Video

Current Patch

Patch History

Patch Report

Everything should persist while navigating.

----------------------------------------------------
ANIMATIONS
----------------------------------------------------

Use Framer Motion.

Page transitions

Card entrance

Stagger animations

Progress animations

Timeline animations

Hover effects

----------------------------------------------------
DESIGN
----------------------------------------------------

Reuse the existing AppLayout.

Do not redesign the dashboard.

Keep the same premium SaaS aesthetic.

Use shadcn/ui components.

Use Tailwind utility classes.

Maintain the existing design tokens.

----------------------------------------------------
ROUTING
----------------------------------------------------

Register all new routes.

Video Details

↓

Create Patch

↓

Patch Preview

↓

Apply Patch

↓

History

↓

Report

Ensure every button correctly navigates to the next step.

----------------------------------------------------
VERIFICATION
----------------------------------------------------

After implementation:

Run npm install if needed.

Run npm run dev

Run npm run build

Fix every TypeScript, React, Tailwind, routing, and import error until both commands pass successfully.

Do not stop after creating files.

The project must compile successfully with zero errors.