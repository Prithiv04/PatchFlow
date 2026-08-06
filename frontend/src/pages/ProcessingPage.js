import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, Cpu, Sparkles, ArrowRight, FileCheck, Music, FileText, Subtitles, Database } from "lucide-react";
const STEPS = [
    { id: "upload", label: "Upload Complete", description: "Video asset buffered & verified", icon: FileCheck },
    { id: "audio", label: "Extracting Audio", description: "Separating high-fidelity audio stream", icon: Music },
    { id: "transcript", label: "Generating Transcript", description: "AI speech-to-text alignment @ 99.2% accuracy", icon: FileText },
    { id: "captions", label: "Creating Captions", description: "Generating time-indexed WebVTT captions", icon: Subtitles },
    { id: "metadata", label: "Preparing Metadata", description: "Indexing frames for patch injection", icon: Database },
    { id: "ready", label: "Ready", description: "Video asset ready for patch creation", icon: Sparkles },
];
export default function ProcessingPage() {
    const navigate = useNavigate();
    const [completedStepIndex, setCompletedStepIndex] = useState(0);
    const [progress, setProgress] = useState(15);
    useEffect(() => {
        // Step completion timer
        const stepInterval = setInterval(() => {
            setCompletedStepIndex((prev) => {
                if (prev < STEPS.length - 1) {
                    return prev + 1;
                }
                clearInterval(stepInterval);
                return prev;
            });
        }, 700);
        // Smooth progress bar timer
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    // Automatically navigate to Video Details page after completion delay
                    setTimeout(() => {
                        navigate("/video/vid-1");
                    }, 800);
                    return 100;
                }
                return prev + 4;
            });
        }, 160);
        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, [navigate]);
    return (_jsxs("div", { className: "max-w-3xl mx-auto space-y-8 py-8 pb-16", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -15 }, animate: { opacity: 1, y: 0 }, className: "glass-card rounded-2xl p-6 md:p-8 space-y-4 border border-primary/30 bg-gradient-to-r from-card via-surface to-card relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "relative z-10 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary", children: [_jsx(Cpu, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Simulated Backend Pipeline" })] }), _jsx("h1", { className: "text-2xl md:text-3xl font-extrabold text-text tracking-tight", children: "Processing Video Asset" }), _jsx("p", { className: "text-muted text-sm", children: "PatchFlow is analyzing timestamps, extracting transcripts, and setting up patch markers." })] }), _jsx("div", { className: "w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-glow", children: _jsx(Loader2, { className: "w-6 h-6 animate-spin" }) })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-semibold", children: [_jsx("span", { className: "text-text", children: "Overall Pipeline Progress" }), _jsxs("span", { className: "text-primary font-mono", children: [progress, "%"] })] }), _jsx("div", { className: "w-full h-3 rounded-full bg-surface border border-border overflow-hidden p-0.5", children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 rounded-full", style: { width: `${progress}%` }, transition: { ease: "easeOut", duration: 0.15 } }) })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "glass-card rounded-2xl p-6 md:p-8 space-y-4 border border-border", children: [_jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-muted mb-4", children: "Pipeline Tasks Checklist" }), _jsx("div", { className: "space-y-3", children: STEPS.map((step, idx) => {
                            const isDone = idx <= completedStepIndex;
                            const isCurrent = idx === completedStepIndex && progress < 100;
                            const StepIcon = step.icon;
                            return (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: idx * 0.08 }, className: `p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${isDone
                                    ? "glass-card bg-primary/5 border-primary/30"
                                    : "bg-card/40 border-border/50 opacity-50"}`, children: [_jsxs("div", { className: "flex items-center gap-3.5", children: [_jsx("div", { className: `w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${isDone
                                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                    : isCurrent
                                                        ? "bg-primary/20 text-primary border border-primary/40"
                                                        : "bg-surface text-muted border border-border"}`, children: isDone ? (_jsx(CheckCircle2, { className: "w-5 h-5" })) : isCurrent ? (_jsx(Loader2, { className: "w-5 h-5 animate-spin" })) : (_jsx(StepIcon, { className: "w-4 h-4" })) }), _jsxs("div", { children: [_jsx("h3", { className: `text-sm font-semibold transition-colors ${isDone ? "text-text" : "text-muted"}`, children: step.label }), _jsx("p", { className: "text-xs text-muted/80", children: step.description })] })] }), _jsx("div", { className: "shrink-0 font-mono text-xs font-semibold", children: isDone ? (_jsx("span", { className: "text-emerald-400 flex items-center gap-1", children: "Done" })) : isCurrent ? (_jsx("span", { className: "text-primary animate-pulse", children: "Running..." })) : (_jsx("span", { className: "text-muted/50", children: "Queued" })) })] }, step.id));
                        }) })] }), _jsx(AnimatePresence, { children: progress >= 100 && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "glass-card rounded-2xl p-5 border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle2, { className: "w-6 h-6 text-emerald-400 shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-text text-sm", children: "Processing Complete!" }), _jsx("p", { className: "text-xs text-muted", children: "Redirecting to Video Details page..." })] })] }), _jsxs("button", { onClick: () => navigate("/video/vid-1"), className: "px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition flex items-center gap-1.5 shrink-0", children: ["Go to Details ", _jsx(ArrowRight, { className: "w-3.5 h-3.5" })] })] })) })] }));
}
