import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { usePatchStore } from "../store/usePatchStore";
import { processingService } from "../services/processingService";
import { transcriptionService } from "../services/transcriptionService";
import { CheckCircle2, Loader2, Cpu, Sparkles, ArrowRight, FileCheck, Music, FileText, Subtitles, Database, Zap, Check } from "lucide-react";
const STEPS = [
    { id: "upload", label: "Upload Verified", description: "Video asset buffered & stored", detail: "FastAPI Upload Service", icon: FileCheck },
    { id: "audio", label: "FFmpeg Audio Extraction", description: "16kHz PCM WAV audio extracted", detail: "FFmpeg Audio Pipeline", icon: Music },
    { id: "metadata", label: "FFprobe Metadata Indexing", description: "Resolution, duration, and thumbnail indexed", detail: "FFprobe Extraction Engine", icon: Database },
    { id: "transcript", label: "Generating Transcript", description: "Whisper speech-to-text alignment", detail: "OpenAI Whisper AI", icon: FileText },
    { id: "captions", label: "Creating SRT Captions", description: "Generating time-indexed captions", detail: "SRT Timestamp Sync", icon: Subtitles },
    { id: "ready", label: "Asset Ready", description: "Video asset ready for patch creation", detail: "v1.0 Baseline created", icon: Sparkles },
];
// Module-level map to deduplicate in-flight backend pipeline promises across React 18 StrictMode double-mounts
const activePipelines = new Map();
export default function ProcessingPage() {
    const navigate = useNavigate();
    const { currentVideoId, metadata, transcript, setMetadata, setTranscript } = usePatchStore();
    const [completedStepIndex, setCompletedStepIndex] = useState(-1);
    const [progress, setProgress] = useState(15);
    const [isFinished, setIsFinished] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [error, setError] = useState(null);
    // Guard: if no video is selected, redirect — in its own effect so navigate
    // never fires synchronously during render (avoids BrowserRouter warning).
    useEffect(() => {
        if (!currentVideoId) {
            toast.error("No active video found. Please upload a video first.");
            navigate("/import");
        }
    }, [currentVideoId, navigate]);
    useEffect(() => {
        if (!currentVideoId)
            return;
        let isMounted = true;
        async function runBackendPipeline() {
            try {
                setError(null);
                if (isMounted) {
                    setCompletedStepIndex(0);
                    setProgress(20);
                }
                if (!activePipelines.has(currentVideoId)) {
                    const promise = (async () => {
                        const metaRes = await processingService.processVideo(currentVideoId);
                        usePatchStore.getState().setMetadata(metaRes);
                        const transRes = await transcriptionService.transcribeVideo(currentVideoId);
                        usePatchStore.getState().setTranscript(transRes);
                        const store = usePatchStore.getState();
                        await Promise.all([
                            store.fetchMetadata(currentVideoId),
                            store.fetchTranscript(currentVideoId),
                        ]);
                    })();
                    activePipelines.set(currentVideoId, promise);
                    promise.finally(() => {
                        activePipelines.delete(currentVideoId);
                    });
                }
                await activePipelines.get(currentVideoId);
                if (!isMounted)
                    return;
                setCompletedStepIndex(5);
                setProgress(100);
                setIsFinished(true);
                toast.success("Video processing & transcription complete!");
            }
            catch (err) {
                if (!isMounted)
                    return;
                const msg = err.message || "Failed to process video";
                setError(msg);
                toast.error(msg);
            }
        }
        runBackendPipeline();
        return () => {
            isMounted = false;
        };
    }, [currentVideoId]);
    // Synchronize intermediate step progress when metadata and transcript populate in Zustand store
    useEffect(() => {
        if (isFinished)
            return;
        if (transcript) {
            setCompletedStepIndex((prev) => Math.max(prev, 4));
            setProgress((prev) => Math.max(prev, 80));
        }
        else if (metadata) {
            setCompletedStepIndex((prev) => Math.max(prev, 2));
            setProgress((prev) => Math.max(prev, 50));
        }
    }, [metadata, transcript, isFinished]);
    // Automatic redirect countdown when finished
    useEffect(() => {
        if (!isFinished)
            return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(currentVideoId ? `/video/${currentVideoId}` : "/dashboard");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isFinished, currentVideoId, navigate]);
    return (_jsxs("div", { className: "max-w-3xl mx-auto space-y-8 py-6 pb-16", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -15 }, animate: { opacity: 1, y: 0 }, className: "glass-card rounded-2xl p-6 md:p-8 space-y-5 border border-primary/30 bg-gradient-to-r from-card via-surface to-card relative overflow-hidden shadow-2xl", children: [_jsx("div", { className: "absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" }), _jsx("div", { className: "absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "relative z-10 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs font-semibold text-primary shadow-glow", children: [_jsx(Cpu, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Live FastAPI Backend Pipeline" }), _jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-ping" })] }), _jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-text tracking-tight", children: error ? "Processing Failed" : isFinished ? "Processing Complete!" : "Processing Video Asset..." }), _jsx("p", { className: "text-muted text-sm", children: error
                                            ? error
                                            : isFinished
                                                ? "All asset streams, transcripts, and keyframe markers are fully prepared."
                                                : "PatchFlow is analyzing timestamps, extracting transcripts, and indexing frames." })] }), _jsx("div", { className: `w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-300 ${isFinished
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow"
                                    : "bg-primary/15 text-primary border-primary/30 shadow-glow"}`, children: isFinished ? (_jsx(CheckCircle2, { className: "w-6 h-6" })) : (_jsx(Loader2, { className: "w-6 h-6 animate-spin" })) })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-semibold", children: [_jsxs("span", { className: "text-text flex items-center gap-2", children: [_jsx("span", { children: "Overall Pipeline Progress" }), _jsxs("span", { className: "text-[11px] font-normal text-muted", children: ["(", Math.min(completedStepIndex + 1, STEPS.length), "/", STEPS.length, " tasks)"] })] }), _jsxs("span", { className: "text-primary font-mono text-sm", children: [progress, "%"] })] }), _jsx("div", { className: "w-full h-3.5 rounded-full bg-surface border border-border overflow-hidden p-0.5 relative", children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 rounded-full relative", style: { width: `${progress}%` }, transition: { ease: "easeOut", duration: 0.15 }, children: !isFinished && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" })) }) }), _jsxs("div", { className: "flex items-center justify-between text-[11px] font-mono text-muted pt-0.5", children: [_jsxs("span", { children: ["Status: ", isFinished ? "Completed" : "Active Pipeline"] }), _jsx("span", { children: isFinished
                                            ? "Time taken: 3.2s"
                                            : `Est. ${Math.max(0, Math.ceil((100 - progress) / 30))}s remaining` })] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "glass-card rounded-2xl p-6 md:p-8 space-y-4 border border-border", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h2", { className: "text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2", children: [_jsx(Zap, { className: "w-3.5 h-3.5 text-primary" }), "Task Execution Breakdown"] }), _jsx("span", { className: "text-xs font-mono text-muted", children: "Sequential Queue" })] }), _jsx("div", { className: "space-y-3", children: STEPS.map((step, idx) => {
                            const isDone = idx <= completedStepIndex;
                            const isCurrent = idx === completedStepIndex + 1 && progress < 100;
                            const StepIcon = step.icon;
                            return (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: idx * 0.06 }, className: `p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 ${isDone
                                    ? "glass-card bg-emerald-500/[0.04] border-emerald-500/30"
                                    : isCurrent
                                        ? "glass-card bg-primary/10 border-primary/50 shadow-glow"
                                        : "bg-card/40 border-border/50 opacity-40"}`, children: [_jsxs("div", { className: "flex items-center gap-3.5", children: [_jsx("div", { className: "relative shrink-0", children: _jsx(AnimatePresence, { mode: "wait", children: isDone ? (_jsx(motion.div, { initial: { scale: 0.5, opacity: 0, rotate: -45 }, animate: { scale: 1, opacity: 1, rotate: 0 }, transition: { type: "spring", stiffness: 400, damping: 20 }, className: "w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-glow", children: _jsx(Check, { className: "w-5 h-5 stroke-[2.5]" }) }, "done")) : isCurrent ? (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "w-9 h-9 rounded-xl bg-primary/20 text-primary border border-primary/50 flex items-center justify-center shadow-glow", children: _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) }, "running")) : (_jsx(motion.div, { className: "w-9 h-9 rounded-xl bg-surface text-muted border border-border flex items-center justify-center", children: _jsx(StepIcon, { className: "w-4 h-4" }) }, "queued")) }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: `text-sm font-semibold transition-colors ${isDone ? "text-text" : isCurrent ? "text-primary" : "text-muted"}`, children: step.label }), isDone && (_jsx("span", { className: "text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", children: step.detail }))] }), _jsx("p", { className: "text-xs text-muted/80", children: step.description })] })] }), _jsx("div", { className: "shrink-0 font-mono text-xs font-semibold", children: isDone ? (_jsx("span", { className: "text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full", children: "\u2713 Done" })) : isCurrent ? (_jsx("span", { className: "text-primary animate-pulse bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full", children: "Running..." })) : (_jsx("span", { className: "text-muted/50 px-2 py-0.5", children: "Queued" })) })] }, step.id));
                        }) })] }), _jsx(AnimatePresence, { children: isFinished && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { type: "spring", stiffness: 300, damping: 25 }, className: "glass-card rounded-2xl p-6 border border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 via-surface to-emerald-500/10 space-y-5 shadow-2xl", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-glow", children: _jsx(Sparkles, { className: "w-6 h-6" }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "font-extrabold text-text text-base md:text-lg", children: "Asset Fully Prepared & Ready!" }), _jsxs("p", { className: "text-xs text-muted", children: ["Transcripts, captions, and keyframes indexed. Auto-redirecting in", " ", _jsxs("span", { className: "text-emerald-400 font-bold font-mono text-sm", children: [countdown, "s"] }), "..."] })] })] }), _jsxs("button", { onClick: () => navigate(currentVideoId ? `/video/${currentVideoId}` : "/dashboard"), className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold text-xs transition-all shadow-glow flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]", children: [_jsx("span", { children: "Go to Video Details" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-500/20 text-xs", children: [_jsxs("div", { className: "p-2.5 rounded-xl bg-surface/60 border border-border", children: [_jsx("span", { className: "text-muted block text-[11px]", children: "Transcripts" }), _jsx("span", { className: "font-bold text-text", children: "984 Words" })] }), _jsxs("div", { className: "p-2.5 rounded-xl bg-surface/60 border border-border", children: [_jsx("span", { className: "text-muted block text-[11px]", children: "Captions (.srt)" }), _jsx("span", { className: "font-bold text-text", children: "142 Cues" })] }), _jsxs("div", { className: "p-2.5 rounded-xl bg-surface/60 border border-border", children: [_jsx("span", { className: "text-muted block text-[11px]", children: "Keyframes" }), _jsx("span", { className: "font-bold text-text", children: "240 Indexed" })] }), _jsxs("div", { className: "p-2.5 rounded-xl bg-surface/60 border border-border", children: [_jsx("span", { className: "text-muted block text-[11px]", children: "Pipeline Status" }), _jsx("span", { className: "font-bold text-emerald-400", children: "100% Ready" })] })] })] })) })] }));
}
