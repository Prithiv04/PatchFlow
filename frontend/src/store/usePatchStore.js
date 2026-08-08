import { create } from "zustand";
import { patchService } from "../services/patchService";
import { processingService } from "../services/processingService";
import { transcriptionService } from "../services/transcriptionService";
const SAVED_VIDEO_ID_KEY = "patchflow_current_video_id";
const SAVED_VIDEO_TITLE_KEY = "patchflow_current_video_title";
const initialVideoId = localStorage.getItem(SAVED_VIDEO_ID_KEY) || null;
const initialVideoTitle = localStorage.getItem(SAVED_VIDEO_TITLE_KEY) || "Uploaded Video";
export const usePatchStore = create((set, get) => ({
    currentVideoId: initialVideoId,
    currentVideoTitle: initialVideoTitle,
    currentPatchCommand: "",
    uploadData: null,
    metadata: null,
    transcript: null,
    activePatch: null,
    historyTimeline: [],
    patchReport: null,
    isLoading: false,
    error: null,
    setCurrentVideoId: (id, title) => {
        localStorage.setItem(SAVED_VIDEO_ID_KEY, id);
        if (title) {
            localStorage.setItem(SAVED_VIDEO_TITLE_KEY, title);
        }
        set({
            currentVideoId: id,
            currentVideoTitle: title || get().currentVideoTitle,
            error: null,
        });
    },
    setUploadData: (data) => set({
        uploadData: data,
        currentVideoId: data.video_id,
        currentVideoTitle: data.filename,
        metadata: null,
        transcript: null,
        error: null,
    }),
    setMetadata: (metadata) => set({ metadata }),
    setTranscript: (transcript) => set({ transcript }),
    setPatchCommand: (cmd) => set({ currentPatchCommand: cmd }),
    setActivePatch: (patch) => set({ activePatch: patch }),
    setPatchReport: (report) => set({ patchReport: report }),
    setError: (err) => set({ error: err }),
    fetchMetadata: async (videoId) => {
        const id = videoId || get().currentVideoId;
        if (!id)
            return null;
        try {
            set({ isLoading: true, error: null });
            const meta = await processingService.getVideoMetadata(id);
            set({ metadata: meta, isLoading: false });
            return meta;
        }
        catch (err) {
            const is404 = err?.response?.status === 404 ||
                err?.status === 404 ||
                String(err?.message || "").includes("404");
            if (is404) {
                set({ isLoading: false });
            }
            else {
                set({ error: err.message || "Failed to fetch metadata", isLoading: false });
            }
            return null;
        }
    },
    fetchTranscript: async (videoId) => {
        const id = videoId || get().currentVideoId;
        if (!id)
            return null;
        try {
            set({ isLoading: true, error: null });
            const t = await transcriptionService.getTranscript(id);
            set({ transcript: t, isLoading: false });
            return t;
        }
        catch (err) {
            const is404 = err?.response?.status === 404 ||
                err?.status === 404 ||
                String(err?.message || "").includes("404");
            if (is404) {
                set({ isLoading: false });
            }
            else {
                set({ error: err.message || "Failed to fetch transcript", isLoading: false });
            }
            return null;
        }
    },
    fetchHistory: async (videoId) => {
        const id = videoId || get().currentVideoId;
        if (!id)
            return null;
        try {
            set({ isLoading: true, error: null });
            const h = await patchService.getHistory(id);
            const items = (h && (h.history || h.timeline)) ? (h.history || h.timeline) : [];
            set({ historyTimeline: items, isLoading: false });
            return h;
        }
        catch (err) {
            set({ historyTimeline: [], error: err.message || "Failed to fetch history", isLoading: false });
            return null;
        }
    },
    resetStore: () => {
        localStorage.removeItem(SAVED_VIDEO_ID_KEY);
        localStorage.removeItem(SAVED_VIDEO_TITLE_KEY);
        set({
            currentVideoId: null,
            currentVideoTitle: "Uploaded Video",
            currentPatchCommand: "",
            uploadData: null,
            metadata: null,
            transcript: null,
            activePatch: null,
            historyTimeline: [],
            patchReport: null,
            isLoading: false,
            error: null,
        });
    },
}));
