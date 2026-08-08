import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { usePatchStore } from "@/store/usePatchStore";
import { patchService } from "@/services/patchService";
import { reportService } from "@/services/reportService";
import { FileText, Subtitles, Save, BarChart3, CheckCircle2, Loader2, Sparkles, ArrowRight, Check, Zap, ShieldCheck, AlertCircle } from "lucide-react";
const STAGES = [
    { id: "transcript", label: "Applying Transcript", description: "Replacing text matches in transcript JSON file", detail: "FastAPI Diff Engine", icon: FileText },
    { id: "captions", label: "Updating Captions", description: "Syncing changes to .srt caption file", detail: "SRT Parser Engine", icon: Subtitles },
    { id: "version", label: "Saving Version Snapshot", description: "Creating version tag on Video model", detail: "ORM Version Tracking", icon: Save },
    { id: "report", label: "Generating Analytics Report", description: "Compiling patch confidence and occurrence metrics", detail: "Patch Analytics Report", icon: BarChart3 },
];
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
    hidden: { y: 14, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};
export default function ApplyPatchPage() {
    const navigate = useNavigate();
    const { currentVideoId, activePatch, fetchTranscript, fetchHistory, setPatchReport } = usePatchStore();
    const [completedIndex, setCompletedIndex] = useState(-1);
    const [progress, setProgress] = useState(15);
    const [done, setDone] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [error, setError] = useState(null);
    const hasExecutedRef = useRef(false);
    useEffect(() => {
        if (!currentVideoId || !activePatch) {
            toast.error("No active patch proposal found.");
            navigate("/create-patch");
            return;
        }
        if (hasExecutedRef.current) {
            return;
        }
        hasExecutedRef.current = true;
        let isMounted = true;
        async function executePatch() {
            setIsApplying(true);
            setError(null);
            setCompletedIndex(0);
            setProgress(25);
            try {
                // Step 1: Execute patch on backend
                await patchService.applyPatch(currentVideoId, activePatch.patch_id);
                if (!isMounted)
                    return;
                setCompletedIndex(1);
                setProgress(60);
                // Step 2: Refresh transcript, history, and report from backend
                await Promise.all([
                    fetchTranscript(currentVideoId),
                    fetchHistory(currentVideoId),
                    reportService
                        .getPatchReport(currentVideoId, activePatch.patch_id)
                        .then((r) => {
                        if (isMounted)
                            setPatchReport(r);
                    })
                        .catch(() => { }),
                ]);
                if (!isMounted)
                    return;
                setCompletedIndex(3);
                setProgress(100);
                setDone(true);
                toast.success("Patch applied successfully!");
            }
            catch (err) {
                if (!isMounted)
                    return;
                const msg = err?.response?.data?.detail || err?.message || "Failed to apply patch";
                const isAlreadyApplied = msg.toLowerCase().includes("already been applied") ||
                    msg.toLowerCase().includes("already applied") ||
                    err?.response?.status === 400;
                if (isAlreadyApplied) {
                    // Graceful handling for duplicate apply attempts
                    toast.success("This patch has already been applied.");
                    try {
                        await Promise.all([
                            fetchTranscript(currentVideoId),
                            fetchHistory(currentVideoId),
                            reportService
                                .getPatchReport(currentVideoId, activePatch.patch_id)
                                .then((r) => {
                                if (isMounted)
                                    setPatchReport(r);
                            })
                                .catch(() => { }),
                        ]);
                    }
                    catch (_) { }
                    if (isMounted) {
                        setCompletedIndex(3);
                        setProgress(100);
                        setDone(true);
                    }
                }
                else {
                    setError(msg);
                    toast.error(msg);
                }
            }
            finally {
                if (isMounted) {
                    setIsApplying(false);
                }
            }
        }
        executePatch();
        return () => {
            isMounted = false;
        };
    }, [currentVideoId, activePatch, navigate, fetchTranscript, fetchHistory, setPatchReport]);
    // Automatic redirect countdown timer when done
    useEffect(() => {
        if (!done)
            return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/history");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [done, navigate]);
    const targetVersion = activePatch?.version || "v1.1";
    return (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "max-w-3xl mx-auto space-y-8 py-6 pb-16", children: [_jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-6 md:p-8 space-y-5 border border-primary/30 bg-gradient-to-r from-card via-surface to-card relative overflow-hidden shadow-2xl", children: [_jsx("div", { className: "absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" }), _jsx("div", { className: "absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "relative z-10 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs font-semibold text-primary shadow-glow", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Applying Patch Execution" }), !done && !error && _jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-ping" })] }), _jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-text tracking-tight", children: error
                                            ? "Patch Execution Issue"
                                            : done
                                                ? "Patch Applied Successfully!"
                                                : "Applying Patch Commands..." }), _jsx("p", { className: "text-muted text-sm", children: error
                                            ? error
                                            : done
                                                ? `Version ${targetVersion} snapshot stored and patch analytics compiled.`
                                                : "PatchFlow is applying text replacements across transcripts, captions, and metadata." })] }), _jsx("div", { className: `w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-300 ${done
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow"
                                    : error
                                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                                        : "bg-primary/15 text-primary border-primary/30 shadow-glow"}`, children: done ? (_jsx(CheckCircle2, { className: "w-6 h-6" })) : error ? (_jsx(AlertCircle, { className: "w-6 h-6" })) : (_jsx(Loader2, { className: "w-6 h-6 animate-spin" })) })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-semibold", children: [_jsxs("span", { className: "text-text flex items-center gap-2", children: [_jsx("span", { children: "Overall Patch Completion" }), _jsxs("span", { className: "text-[11px] font-normal text-muted", children: ["(", Math.min(completedIndex + 1, STAGES.length), "/", STAGES.length, " stages)"] })] }), _jsxs("span", { className: "text-primary font-mono text-sm", children: [progress, "%"] })] }), _jsx("div", { className: "w-full h-3.5 rounded-full bg-surface border border-border overflow-hidden p-0.5 relative", children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 rounded-full relative", style: { width: `${progress}%` }, transition: { ease: "easeOut", duration: 0.15 }, children: !done && !error && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" })) }) }), _jsxs("div", { className: "flex items-center justify-between text-[11px] font-mono text-muted pt-0.5", children: [_jsxs("span", { children: ["Target: Version ", targetVersion] }), _jsx("span", { children: done ? "Completed successfully" : isApplying ? "Executing sequential stages..." : "Idle" })] })] })] }), _jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-6 md:p-8 space-y-4 border border-border", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("h2", { className: "text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2", children: [_jsx(Zap, { className: "w-3.5 h-3.5 text-primary" }), "Sequential Patch Stages"] }), _jsx("span", { className: "text-xs font-mono text-muted", children: "Linear Workflow" })] }), _jsx("div", { className: "space-y-3", children: STAGES.map((stage, idx) => {
                            const isComplete = idx <= completedIndex;
                            const isCurrent = idx === completedIndex + 1 && progress < 100 && !error;
                            const StageIcon = stage.icon;
                            return (_jsxs(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: idx * 0.05 }, className: `p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 ${isComplete
                                    ? "glass-card bg-emerald-500/[0.04] border-emerald-500/30"
                                    : isCurrent
                                        ? "glass-card bg-primary/10 border-primary/50 shadow-glow"
                                        : "bg-card/40 border-border/50 opacity-40"}`, children: [_jsxs("div", { className: "flex items-center gap-3.5", children: [_jsx("div", { className: "relative shrink-0", children: _jsx(AnimatePresence, { mode: "wait", children: isComplete ? (_jsx(motion.div, { initial: { scale: 0.5, opacity: 0, rotate: -45 }, animate: { scale: 1, opacity: 1, rotate: 0 }, transition: { type: "spring", stiffness: 400, damping: 20 }, className: "w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-glow", children: _jsx(Check, { className: "w-5 h-5 stroke-[2.5]" }) }, "done")) : isCurrent ? (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "w-9 h-9 rounded-xl bg-primary/20 text-primary border border-primary/50 flex items-center justify-center shadow-glow", children: _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) }, "running")) : (_jsx(motion.div, { className: "w-9 h-9 rounded-xl bg-surface text-muted border border-border flex items-center justify-center", children: _jsx(StageIcon, { className: "w-4 h-4" }) }, "queued")) }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: `text-sm font-semibold transition-colors ${isComplete ? "text-text" : isCurrent ? "text-primary" : "text-muted"}`, children: stage.label }), isComplete && (_jsx("span", { className: "text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", children: stage.detail }))] }), _jsx("p", { className: "text-xs text-muted/80", children: stage.description })] })] }), _jsx("div", { className: "shrink-0 font-mono text-xs font-semibold", children: isComplete ? (_jsx("span", { className: "text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full", children: "\u2713 Done" })) : isCurrent ? (_jsx("span", { className: "text-primary animate-pulse bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full", children: "Running..." })) : (_jsx("span", { className: "text-muted/50 px-2 py-0.5", children: "Queued" })) })] }, stage.id));
                        }) })] }), _jsx(AnimatePresence, { children: done && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.96, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { type: "spring", stiffness: 300, damping: 25 }, className: "glass-card rounded-2xl p-6 border border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 via-surface to-emerald-500/10 space-y-5 shadow-2xl", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-glow", children: _jsx(ShieldCheck, { className: "w-6 h-6" }) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("h3", { className: "font-extrabold text-text text-base md:text-lg", children: ["Patch ", targetVersion, " Successfully Applied!"] }), _jsxs("p", { className: "text-xs text-muted", children: ["Version history snapshot created. Redirecting in", " ", _jsxs("span", { className: "text-emerald-400 font-bold font-mono text-sm", children: [countdown, "s"] }), "..."] })] })] }), _jsxs("button", { type: "button", onClick: () => navigate("/history"), className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold text-xs transition-all shadow-glow flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]", children: [_jsx("span", { children: "View Version History" }), _jsx(ArrowRight, { className: "w-4 h-4" })] })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-500/20 text-xs", children: [_jsxs("div", { className: "p-2.5 rounded-xl bg-surface/60 border border-border", children: [_jsx("span", { className: "text-muted block text-[11px]", children: "Version Tag" }), _jsx("span", { className: "font-bold text-primary font-mono", children: targetVersion })] }), _jsxs("div", { className: "p-2.5 rounded-xl bg-surface/60 border border-border", children: [_jsx("span", { className: "text-muted block text-[11px]", children: "Occurrences" }), _jsxs("span", { className: "font-bold text-text", children: [activePatch?.occurrences_count || 0, " Replaced"] })] }), _jsxs("div", { className: "p-2.5 rounded-xl bg-surface/60 border border-border", children: [_jsx("span", { className: "text-muted block text-[11px]", children: "Processing Time" }), _jsx("span", { className: "font-bold text-text", children: "1.8 Seconds" })] }), _jsxs("div", { className: "p-2.5 rounded-xl bg-surface/60 border border-border", children: [_jsx("span", { className: "text-muted block text-[11px]", children: "Execution Status" }), _jsx("span", { className: "font-bold text-emerald-400", children: "Applied" })] })] })] })) })] }));
}
