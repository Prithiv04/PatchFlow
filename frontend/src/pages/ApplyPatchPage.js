import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, Subtitles, MessageSquare, Save, BarChart3, CheckCircle2, Loader2, Sparkles, ArrowRight, } from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
const STAGES = [
    { id: "transcript", label: "Applying Transcript", description: "Replacing text matches in transcript file", icon: FileText },
    { id: "captions", label: "Updating Captions", description: "Syncing changes to .srt caption file", icon: Subtitles },
    { id: "description", label: "Updating Description", description: "Applying text diff to video description", icon: FileText },
    { id: "pinned", label: "Updating Pinned Comment", description: "Patching pinned comment content", icon: MessageSquare },
    { id: "version", label: "Saving Version", description: "Creating immutable v1.3 snapshot", icon: Save },
    { id: "report", label: "Generating Report", description: "Compiling patch analytics and summary", icon: BarChart3 },
];
const STAGE_DURATION = 650; // ms per stage
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
    const { currentPatchCommand, addPatchEntry, setPatchReport } = usePatchStore();
    const [completedIndex, setCompletedIndex] = useState(-1);
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    useEffect(() => {
        let stageIdx = -1;
        const stageInterval = setInterval(() => {
            stageIdx += 1;
            setCompletedIndex(stageIdx);
            if (stageIdx >= STAGES.length - 1) {
                clearInterval(stageInterval);
                setDone(true);
                // Persist patch entry and report
                addPatchEntry({
                    id: `patch-${Date.now()}`,
                    version: "v1.3",
                    date: "Just now",
                    author: "Jane Doe",
                    command: currentPatchCommand || "Replace every occurrence of GPT-4 with GPT-5.",
                    summary: "Text replacement patch applied across all assets successfully.",
                    assetsAffected: ["Transcript", "Captions", "Description", "Pinned Comment"],
                    occurrences: 14,
                    status: "applied",
                });
                setPatchReport({
                    assetsUpdated: 4,
                    occurrencesChanged: 14,
                    processingTime: "3.8s",
                    patchSuccess: true,
                    table: [
                        { asset: "Transcript", version: "v1.3", status: "Applied", changes: 8 },
                        { asset: "Captions (.srt)", version: "v1.3", status: "Applied", changes: 3 },
                        { asset: "Description", version: "v1.3", status: "Applied", changes: 2 },
                        { asset: "Pinned Comment", version: "v1.3", status: "Applied", changes: 1 },
                    ],
                });
                setTimeout(() => navigate("/history"), 900);
            }
        }, STAGE_DURATION);
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, STAGE_DURATION * STAGES.length / 50);
        return () => {
            clearInterval(stageInterval);
            clearInterval(progressInterval);
        };
    }, []);
    return (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "max-w-3xl mx-auto space-y-8 pb-16", children: [_jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-6 md:p-8 border border-primary/30 bg-gradient-to-r from-card via-surface to-card relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "relative z-10 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Applying Patch" })] }), _jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-text tracking-tight", children: "Patch in Progress..." }), _jsx("p", { className: "text-muted text-sm", children: "PatchFlow is writing changes across all detected assets." })] }), _jsx("div", { className: "w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0", children: _jsx(Loader2, { className: "w-6 h-6 animate-spin" }) })] }), _jsxs("div", { className: "space-y-2 pt-5", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-semibold", children: [_jsx("span", { className: "text-text", children: "Patch Progress" }), _jsxs("span", { className: "text-primary font-mono", children: [progress, "%"] })] }), _jsx("div", { className: "w-full h-3 rounded-full bg-surface border border-border overflow-hidden p-0.5", children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 rounded-full", style: { width: `${progress}%` }, transition: { ease: "easeOut", duration: 0.15 } }) })] })] }), _jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-6 border border-border space-y-3", children: [_jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-muted mb-2", children: "Patch Stages" }), STAGES.map((stage, idx) => {
                        const isComplete = idx <= completedIndex;
                        const isCurrent = idx === completedIndex + 1;
                        const StageIcon = stage.icon;
                        return (_jsxs(motion.div, { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: idx * 0.05 }, className: `p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${isComplete
                                ? "bg-primary/5 border-primary/25"
                                : isCurrent
                                    ? "bg-card border-border"
                                    : "bg-card/30 border-border/40 opacity-40"}`, children: [_jsxs("div", { className: "flex items-center gap-3.5", children: [_jsx("div", { className: `w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isComplete
                                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                : isCurrent
                                                    ? "bg-primary/20 text-primary border border-primary/40"
                                                    : "bg-surface text-muted border border-border"}`, children: isComplete ? (_jsx(CheckCircle2, { className: "w-5 h-5" })) : isCurrent ? (_jsx(Loader2, { className: "w-5 h-5 animate-spin" })) : (_jsx(StageIcon, { className: "w-4 h-4" })) }), _jsxs("div", { children: [_jsx("h3", { className: `text-sm font-semibold ${isComplete ? "text-text" : "text-muted"}`, children: stage.label }), _jsx("p", { className: "text-[11px] text-muted/80", children: stage.description })] })] }), _jsx("span", { className: `text-xs font-mono font-semibold shrink-0 ${isComplete ? "text-emerald-400" : isCurrent ? "text-primary animate-pulse" : "text-muted/40"}`, children: isComplete ? "Done" : isCurrent ? "Running..." : "Queued" })] }, stage.id));
                    })] }), _jsx(AnimatePresence, { children: done && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, className: "glass-card rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle2, { className: "w-6 h-6 text-emerald-400 shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-text text-sm", children: "Patch Applied Successfully!" }), _jsx("p", { className: "text-xs text-muted", children: "Navigating to Version History..." })] })] }), _jsxs("button", { onClick: () => navigate("/history"), className: "px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs flex items-center gap-1.5 shrink-0 transition", children: ["View History ", _jsx(ArrowRight, { className: "w-3.5 h-3.5" })] })] })) })] }));
}
