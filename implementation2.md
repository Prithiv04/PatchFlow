Implement the Upload Video page for PatchFlow.

IMPORTANT:
- Do NOT implement any backend logic.
- Do NOT create API calls.
- Do NOT upload files anywhere.
- Use only mock state and frontend interactions.
- The page must match the exact premium SaaS design language already used in the Dashboard (Linear + Vercel + Supabase aesthetic).
- This page should feel like a real production product, not a placeholder.

==========================================================
DESIGN REQUIREMENTS
==========================================================

Continue using the existing design system.

Dark theme.

Glassmorphism cards.

Purple primary accent.

16px rounded corners.

8px spacing system.

Inter font.

Smooth Framer Motion animations.

Fully responsive.

Use Tailwind.

Use shadcn/ui components wherever appropriate.

==========================================================
LAYOUT
==========================================================

Header:
- Title: "Import Video"
- Subtitle:
  "Upload a video and its associated metadata to start creating patches."

Below the header place a large upload card.

==========================================================
UPLOAD CARD
==========================================================

Large drag-and-drop upload area.

Show:

Upload icon

"Drag & Drop your video"

or

"Browse Files"

Supported formats

MP4
MOV
AVI
MKV

Maximum size

2GB

The upload area should have:

dashed border

glass background

hover animation

drag-over animation

click to browse

Show selected filename after choosing a file.

Do NOT upload anything.

Keep the selected file in frontend state only.

==========================================================
VIDEO INFORMATION
==========================================================

Below the upload area create another glass card.

Fields:

Video Title

Description (large textarea)

Pinned Comment (large textarea)

Category dropdown

Examples:

Tutorial

Review

Podcast

News

Education

==========================================================
VIDEO PREVIEW
==========================================================

When a user selects a file:

Show a preview card.

Display

Video thumbnail placeholder

Filename

Size

Duration placeholder

Status

Ready for upload

No backend.

No real metadata extraction required.

==========================================================
UPLOAD ACTION
==========================================================

Bottom right:

Primary button

"Upload Video"

Secondary button

Cancel

When Upload Video is clicked:

Do NOT call an API.

Instead:

Show a beautiful upload progress modal.

Example:

Uploading...

█████████████████

100%

Then automatically transition to a Processing page after a short delay.

Use frontend navigation only.

==========================================================
PROCESSING PAGE
==========================================================

Create a dedicated Processing page.

This page simulates backend work.

Animated checklist:

✓ Upload Complete

✓ Extracting Audio

✓ Generating Transcript

✓ Creating Captions

✓ Preparing Metadata

✓ Ready

Each item should animate one after another.

Display a progress bar.

When progress reaches 100%,

navigate to a mock Video Details page.

==========================================================
ANIMATIONS
==========================================================

Use Framer Motion.

Card fade-in

Button hover

Upload area glow

Progress animation

Checklist stagger animation

Page transitions

==========================================================
RESPONSIVENESS
==========================================================

Desktop:
Centered upload card.

Tablet:
Responsive two-column layout where appropriate.

Mobile:
Single-column layout.

==========================================================
CODE QUALITY
==========================================================

Use reusable components.

No inline styles.

Proper folder structure.

Use existing AppLayout.

Use TypeScript.

Strict typing.

No placeholder "Hello World" components.

Everything should look production-ready.

==========================================================
IMPORTANT
==========================================================

This is ONLY the frontend.

Do NOT create FastAPI endpoints.

Do NOT write backend code.

Do NOT implement real uploads.

Mock everything while making the experience feel completely real.

The result should look polished enough to be shown in a hackathon demo before backend integration.