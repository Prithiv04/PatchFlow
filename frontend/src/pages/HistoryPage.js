import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { History, ChevronDown, ChevronRight, FileCode2, Plus, RotateCcw, BarChart3, Zap, Loader2, AlertCircle, Film, } from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
import { patchService } from "@/services/patchService";
import { exportService } from "@/services/exportService";
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { y: 14, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};
export default function HistoryPage() {
    const { currentVideoId, currentVideoTitle, historyTimeline, fetchHistory, fetchTranscript, isLoading, error } = usePatchStore();
    const [expanded, setExpanded] = useState(null);
    const [revertingId, setRevertingId] = useState(null);
    useEffect(() => {
        if (currentVideoId) {
            fetchHistory(currentVideoId);
        }
    }, [currentVideoId, fetchHistory]);
    const timeline = Array.isArray(historyTimeline) ? historyTimeline : [];
    const handleRevert = async (patchId) => {
        if (!currentVideoId)
            return;
        try {
            setRevertingId(patchId);
            await patchService.revertPatch(currentVideoId, patchId);
            toast.success("Patch reverted successfully! Asset restored to previous state.");
            await Promise.all([fetchHistory(currentVideoId), fetchTranscript(currentVideoId)]);
        }
        catch (err) {
            toast.error(err.message || "Failed to revert patch");
        }
        finally {
            setRevertingId(null);
        }
    };
    return (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "max-w-4xl mx-auto space-y-8 pb-16", children: [_jsxs(motion.div, { variants: itemVariants, className: "space-y-2", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-glow", children: [_jsx(History, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Live Version Timeline" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-text tracking-tight", children: "Patch History & Versions" }), _jsxs("p", { className: "text-muted text-sm mt-1", children: ["All patch versions and rollback states for", " ", _jsx("span", { className: "text-text font-semibold", children: currentVideoTitle || "Uploaded Video" })] })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [_jsxs("span", { className: "text-xs font-mono text-muted bg-surface border border-border px-2.5 py-1 rounded-lg", children: [timeline.length, " versions"] }), _jsxs(Link, { to: "/create-patch", className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white font-semibold text-sm shadow-glow transition-all active:scale-[0.98]", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Patch"] })] })] })] }), isLoading && (_jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-12 border border-border flex flex-col items-center justify-center space-y-4 text-center", children: [_jsx(Loader2, { className: "w-8 h-8 text-primary animate-spin" }), _jsx("p", { className: "text-sm font-semibold text-text", children: "Loading version history..." })] })), !isLoading && error && (_jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-8 border border-rose-500/30 bg-rose-500/5 space-y-3 text-center", children: [_jsx(AlertCircle, { className: "w-8 h-8 text-rose-400 mx-auto" }), _jsx("h2", { className: "text-lg font-bold text-text", children: "Unable to load version history" }), _jsx("p", { className: "text-xs text-muted max-w-md mx-auto", children: error })] })), !isLoading && !error && !currentVideoId && (_jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-12 border border-border flex flex-col items-center justify-center space-y-4 text-center", children: [_jsx(Film, { className: "w-10 h-10 text-primary opacity-60" }), _jsx("h2", { className: "text-lg font-bold text-text", children: "No active video selected" }), _jsx("p", { className: "text-xs text-muted max-w-md", children: "Please import or select a video asset to view its patch timeline history." }), _jsx(Link, { to: "/import", className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-semibold shadow-glow", children: "Import Video Asset" })] })), !isLoading && !error && currentVideoId && timeline.length === 0 && (_jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-12 border border-border flex flex-col items-center justify-center space-y-4 text-center", children: [_jsx(History, { className: "w-10 h-10 text-muted opacity-60" }), _jsx("h2", { className: "text-lg font-bold text-text", children: "No versions recorded yet" }), _jsx("p", { className: "text-xs text-muted max-w-md", children: "Create your first patch to build out the version history timeline for this video asset." }), _jsx(Link, { to: "/create-patch", className: "px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-semibold shadow-glow", children: "Create First Patch" })] })), !isLoading && !error && timeline.length > 0 && (_jsxs(motion.div, { variants: itemVariants, className: "relative", children: [_jsx("div", { className: "absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/60 via-border/60 to-transparent" }), _jsx("div", { className: "space-y-5", children: timeline.map((entry, idx) => {
                            const isLatest = idx === timeline.length - 1;
                            const patchId = entry.patch_id || (entry.id && entry.id !== "original" ? entry.id : null);
                            const entryKey = patchId || `v-${entry.version || idx}`;
                            const isExpanded = expanded === entryKey;
                            const isOriginal = entry.type === "initial_upload" || entry.status === "original" || entry.id === "original";
                            const isReverted = entry.status === "reverted";
                            const promptText = entry.prompt || entry.command || entry.summary || "Baseline Version";
                            const timestamp = entry.applied_at || entry.date || "";
                            const occurrences = entry.occurrences_changed ?? entry.occurrences ?? 0;
                            const typeLabel = entry.type || (isOriginal ? "initial_upload" : "patch");
                            return (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: idx * 0.05 }, className: "relative pl-12", children: [_jsx("div", { className: `absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border text-xs shadow-glow transition-all ${isLatest
                                            ? "bg-primary text-white border-primary ring-4 ring-primary/20 scale-110"
                                            : isReverted
                                                ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                                : "bg-surface text-muted border-border"}`, children: isOriginal ? (_jsx(FileCode2, { className: "w-3.5 h-3.5" })) : (_jsx(Zap, { className: "w-3.5 h-3.5" })) }), _jsxs("div", { className: `glass-card rounded-2xl border transition-all ${isLatest ? "border-primary/40 shadow-glow" : "border-border"}`, children: [_jsxs("button", { type: "button", onClick: () => setExpanded(isExpanded ? null : entryKey), className: "w-full p-5 text-left flex items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1 truncate", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-primary/20 text-primary border border-primary/30", children: entry.version }), isLatest && (_jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", children: "Active Baseline" })), isReverted && (_jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20", children: "Reverted" })), timestamp && _jsx("span", { className: "text-xs text-muted font-mono", children: timestamp })] }), _jsx("p", { className: "font-bold text-text text-sm truncate", children: promptText })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [_jsx("span", { className: "text-xs text-muted font-medium hidden sm:inline-block", children: entry.author || "System User" }), isExpanded ? (_jsx(ChevronDown, { className: "w-4 h-4 text-muted" })) : (_jsx(ChevronRight, { className: "w-4 h-4 text-muted" }))] })] }), _jsx(AnimatePresence, { children: isExpanded && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "px-5 pb-5 pt-2 border-t border-border/50 space-y-4 text-xs", children: [_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface p-3.5 rounded-xl border border-border", children: [_jsxs("div", { children: [_jsx("span", { className: "text-muted block font-semibold", children: "Changes" }), _jsxs("span", { className: "font-mono text-text", children: [occurrences, " matches"] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted block font-semibold", children: "Author" }), _jsx("span", { className: "text-text", children: entry.author || "System User" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted block font-semibold", children: "Status" }), _jsx("span", { className: "font-semibold text-emerald-400 capitalize", children: entry.status })] }), _jsxs("div", { children: [_jsx("span", { className: "text-muted block font-semibold", children: "Type" }), _jsx("span", { className: "font-mono text-primary uppercase", children: typeLabel })] })] }), _jsxs("div", { className: "flex items-center justify-between gap-3 pt-2", children: [patchId && currentVideoId && (_jsxs("button", { onClick: () => exportService.downloadPatchReport(currentVideoId, patchId), className: "inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline", children: [_jsx(BarChart3, { className: "w-3.5 h-3.5" }), " Download Patch Report"] })), patchId && entry.status === "applied" && (_jsxs("button", { onClick: () => handleRevert(patchId), disabled: revertingId === patchId, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition", children: [_jsx(RotateCcw, { className: "w-3.5 h-3.5" }), revertingId === patchId ? "Reverting..." : "Revert Patch"] }))] })] })) })] })] }, entryKey));
                        }) })] }))] }));
}
