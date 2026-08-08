export interface UploadResponse {
  video_id: string;
  filename: string;
  file_size: number;
  content_type: string;
  uploaded_at: string;
}

export interface ProcessingResponse {
  video_id: string;
  status: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
  video_codec: string;
  audio_codec: string | null;
  bitrate: number;
  container: string;
  thumbnail: string;
  audio_file: string;
  resolution: string;
  codec: string;
  processing_timestamp: string;
  processed_at: string;
}

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface TranscriptResponse {
  video_id: string;
  status: string;
  language: string;
  full_text: string;
  segments: TranscriptSegment[];
  segments_count: number;
  transcript_file: string;
  caption_file: string;
  created_at: string;
}

export interface PatchDiff {
  asset_type: string;
  segment_id: number;
  start: number;
  end: number;
  original: string;
  patched: string;
  target: string;
  replacement: string;
}

export interface SegmentCandidate {
  segment_id: number;
  start: number;
  end: number;
  score: number;
  text: string;
  matched_text?: string;
  target: string;
  replacement: string;
  original: string;
  patched: string;
  is_exact: boolean;
}

export interface PatchAnalysisResponse {
  patch_id: string;
  video_id: string;
  prompt: string;
  status: "analyzed" | "applied" | "reverted";
  occurrences_count: number;
  affected_assets: string[];
  diffs: PatchDiff[];
  confidence_score: number;
  warnings: string[];
  version: string | null;
  created_at: string;
  parsed_operation?: string;
  parsed_target?: string;
  parsed_replacement?: string;
  candidate_segments?: SegmentCandidate[];
}

export interface HistoryTimelineEntry {
  id?: string;
  version: string;
  type?: "initial_upload" | "patch_proposal" | string;
  patch_id?: string | null;
  prompt?: string;
  command?: string;
  summary?: string;
  applied_at?: string;
  date?: string;
  status: "original" | "applied" | "reverted" | string;
  occurrences_changed?: number;
  occurrences?: number;
  author: string;
  assets_affected?: string[];
}

export interface HistoryResponse {
  video_id: string;
  total_versions: number;
  current_version?: string;
  history?: HistoryTimelineEntry[];
  timeline?: HistoryTimelineEntry[];
}

export interface PatchReportData {
  video_id: string;
  patch_id: string;
  version: string;
  prompt: string;
  status: string;
  occurrences_changed: number;
  confidence_score: number;
  assets_updated: string[];
  diffs: PatchDiff[];
  warnings: string[];
  applied_at: string | null;
  export_timestamp: string;
}
