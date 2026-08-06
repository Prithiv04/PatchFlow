import { create } from "zustand";

export interface PatchEntry {
  id: string;
  version: string;
  date: string;
  author: string;
  command: string;
  summary: string;
  assetsAffected: string[];
  occurrences: number;
  status: "applied" | "failed" | "pending";
}

export interface PatchReport {
  assetsUpdated: number;
  occurrencesChanged: number;
  processingTime: string;
  patchSuccess: boolean;
  table: { asset: string; version: string; status: string; changes: number }[];
}

interface PatchStore {
  currentVideoId: string;
  currentVideoTitle: string;
  currentPatchCommand: string;
  patchHistory: PatchEntry[];
  patchReport: PatchReport | null;
  setCurrentVideo: (id: string, title: string) => void;
  setPatchCommand: (cmd: string) => void;
  addPatchEntry: (entry: PatchEntry) => void;
  setPatchReport: (report: PatchReport) => void;
}

const DEFAULT_HISTORY: PatchEntry[] = [
  {
    id: "patch-h1",
    version: "v1.0",
    date: "Original Upload",
    author: "Jane Doe",
    command: "Original asset",
    summary: "Initial video upload before any patches were applied.",
    assetsAffected: [],
    occurrences: 0,
    status: "applied",
  },
  {
    id: "patch-h2",
    version: "v1.1",
    date: "2 hours ago",
    author: "Jane Doe",
    command: "Replace every occurrence of GPT-4 with GPT-5.",
    summary: "GPT-4 → GPT-5 replacement across transcript, captions, description, and pinned comment.",
    assetsAffected: ["Transcript", "Captions", "Description", "Pinned Comment"],
    occurrences: 14,
    status: "applied",
  },
  {
    id: "patch-h3",
    version: "v1.2",
    date: "Yesterday",
    author: "Alex Rivera",
    command: "Update pricing from $19/mo to $29/mo.",
    summary: "Pricing tier update replacing outdated $19/mo references.",
    assetsAffected: ["Transcript", "Description"],
    occurrences: 6,
    status: "applied",
  },
];

export const usePatchStore = create<PatchStore>((set) => ({
  currentVideoId: "vid-1",
  currentVideoTitle: "Product Overview & Onboarding 2026",
  currentPatchCommand: "",
  patchHistory: DEFAULT_HISTORY,
  patchReport: null,
  setCurrentVideo: (id, title) => set({ currentVideoId: id, currentVideoTitle: title }),
  setPatchCommand: (cmd) => set({ currentPatchCommand: cmd }),
  addPatchEntry: (entry) =>
    set((state) => ({ patchHistory: [...state.patchHistory, entry] })),
  setPatchReport: (report) => set({ patchReport: report }),
}));
