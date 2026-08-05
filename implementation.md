Video Patch Frontend Implementation Plan

Vision

Build a premium SaaS frontend for Video Patch, a platform that helps creators maintain YouTube content through declarative patches. This is a fresh product, not a recreation of an existing website.

Goals

Modern developer-tool aesthetic (Linear/Vercel/Notion inspired)

Dark theme

Component-first architecture

Pixel-consistent spacing

Mock data only (no backend yet)

Tech Stack

React + Vite + TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

React Router

Lucide React

React Hook Form

Zod

Folder Structure

src/
  assets/
  components/
    common/
    dashboard/
    upload/
    processing/
    patch/
    history/
    report/
  layouts/
  pages/
  hooks/
  lib/
  services/
  store/
  styles/
  types/
  utils/

Design System

Colors

Background #09090BSurface #16161FSidebar #111118Border #27272APrimary #7C3AEDSuccess #22C55EWarning #F59E0BDanger #EF4444Text #FFFFFFMuted #A1A1AA

Typography

Inter only.Radius:16px.8px spacing grid.

App Flow

Dashboard

Import Video

Processing

Video Details

Create Patch

Impact Analysis

Preview Changes

Apply Patch

History

Patch Report

Pages

Dashboard

Sidebar

Header

Stats cards

Recent videos

Recent patches

Quick actions

Import Video

Drag & drop

Metadata form

Upload CTA

Processing

Animated checklist:

Uploading

Extracting audio

Transcribing

Generating captions

Preparing assets

Video Details

Thumbnail

Metadata

Assets

Version

Create Patch button

Create Patch

Command editor

Examples

Analyze button

Impact Analysis

Affected assets

Counts

Manual review warnings

Preview

Before/After diff

Apply button

Apply

Animated progress

Step status

History

Timeline

Patch cards

Report

Summary

Changes

Download buttons

Components

Sidebar, Topbar, Button, Card, Badge, UploadZone, VideoCard,PatchEditor, DiffViewer, Timeline, ProgressCard, ReportCard,Toast, Modal, Tabs, Accordion.

Animations

Fade page transitions

Hover lift

Button scale

Smooth progress

Card stagger

State

Use mock JSON.Global UI state with Context or Zustand.

Coding Standards

Strict TypeScript

Functional components

Reusable UI

No inline styles

Tailwind only

Small focused components

Milestones

Phase 1: Setup & Design SystemPhase 2: Layout & SidebarPhase 3: DashboardPhase 4: Import FlowPhase 5: ProcessingPhase 6: Patch WorkflowPhase 7: History & ReportPhase 8: Polish & Responsive

Definition of Done

Premium polished UI

Responsive desktop/tablet

Smooth animations

Mock data everywhere

Ready for backend integration