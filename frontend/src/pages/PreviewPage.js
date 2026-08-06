import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileCode2, AlertTriangle, CheckCircle2, Clock, Layers, Target, Zap, FileText, MessageSquare, Subtitles, Sparkles, ShieldCheck, ChevronDown, ChevronRight, Copy, Check, Activity } from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
const MOCK_DIFFS = [
    {
        asset: "Transcript",
        filename: "transcript.txt",
        icon: FileText,
        changes: [
            { line: 12, removed: 'Built using GPT-4 for summarization and asset indexing.', added: 'Built using GPT-5 for summarization and asset indexing.' },
            { line: 45, removed: 'GPT-4 processes the audio stream in real time.', added: 'GPT-5 processes the audio stream in real time.' },
            { line: 88, removed: 'This GPT-4 integration reduces rendering latency by 80%.', added: 'This GPT-5 integration reduces rendering latency by 80%.' },
        ],
    },
    {
        asset: "Captions",
        filename: "captions.vtt",
        icon: Subtitles,
        changes: [
            { line: 4, removed: '00:01:15.000 --> 00:01:18.500: with GPT-4 engine', added: '00:01:15.000 --> 00:01:18.500: with GPT-5 engine' },
            { line: 19, removed: '00:02:40.200 --> 00:02:44.000: powered by GPT-4', added: '00:02:40.200 --> 00:02:44.000: powered by GPT-5' },
        ],
    },
    {
        asset: "Description",
        filename: "description.md",
        icon: FileText,
        changes: [
            { line: 3, removed: 'Built using GPT-4 API integration for automated video patches.', added: 'Built using GPT-5 API integration for automated video patches.' },
        ],
    },
    {
        asset: "Pinned Comment",
        filename: "pinned_comment.json",
        icon: MessageSquare,
        changes: [
            { line: 1, removed: '"comment": "Check out our GPT-4 tutorial series — Episode 3"', added: '"comment": "Check out our GPT-5 tutorial series — Episode 3"' },
        ],
    },
];
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};
export default function PreviewPage() {
    const navigate = useNavigate();
    const { currentPatchCommand, currentVideoTitle } = usePatchStore();
    const [copied, setCopied] = useState(false);
    const [collapsedFiles, setCollapsedFiles] = useState({});
    const displayCommand = currentPatchCommand?.trim() || 'Replace every occurrence of "GPT-4" with "GPT-5".';
    const totalOccurrences = MOCK_DIFFS.reduce((acc, d) => acc + d.changes.length, 0);
    const handleCopyCommand = () => {
        navigator.clipboard.writeText(displayCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const toggleFile = (filename) => {
        setCollapsedFiles((prev) => ({ ...prev, [filename]: !prev[filename] }));
    };
    return (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "max-w-5xl mx-auto space-y-8 pb-16", children: [_jsxs(motion.div, { variants: itemVariants, className: "space-y-2", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-glow", children: [_jsx(FileCode2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "AI Diff Analysis" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-text tracking-tight", children: "Review Patch Diff" }), _jsxs("p", { className: "text-muted text-sm md:text-base", children: ["Pre-flight verification for ", _jsx("span", { className: "text-text font-semibold", children: currentVideoTitle })] })] }), _jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-5 border border-primary/30 bg-gradient-to-r from-primary/10 via-surface to-card space-y-2 relative shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Zap, { className: "w-4 h-4 text-primary" }), "Active Patch Command"] }), _jsx("button", { type: "button", onClick: handleCopyCommand, className: "text-xs text-muted hover:text-text flex items-center gap-1 transition px-2.5 py-1 rounded-lg bg-surface border border-border", children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-3.5 h-3.5 text-emerald-400" }), _jsx("span", { className: "text-emerald-400 font-semibold", children: "Copied!" })] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Copy Command" })] })) })] }), _jsxs("p", { className: "text-base font-semibold text-text font-mono bg-black/40 p-3 rounded-xl border border-white/10", children: ["\"", displayCommand, "\""] })] }), _jsx(motion.div, { variants: itemVariants, className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: "Assets Affected", value: MOCK_DIFFS.length, detail: "4 Files Verified", icon: Layers, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                    { label: "Occurrences", value: totalOccurrences, detail: "7 Matches Replaced", icon: Target, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                    { label: "AI Confidence", value: "98.4%", detail: "High Precision Match", icon: ShieldCheck, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                    { label: "Est. Render Time", value: "~4s", detail: "0s Audio Re-render", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                ].map(({ label, value, detail, icon: Icon, color }) => (_jsxs(motion.div, { whileHover: { y: -3 }, className: "glass-card rounded-2xl p-5 border border-border flex flex-col justify-between space-y-3 h-full shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-semibold text-muted uppercase tracking-wider", children: label }), _jsx("div", { className: `w-9 h-9 rounded-xl border flex items-center justify-center ${color}`, children: _jsx(Icon, { className: "w-4.5 h-4.5" }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-extrabold text-text tracking-tight", children: value }), _jsx("p", { className: "text-[11px] text-muted/80 mt-1", children: detail })] })] }, label))) }), _jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-6 border border-border space-y-4 shadow-xl", children: [_jsxs("h2", { className: "text-base font-bold text-text flex items-center gap-2", children: [_jsx(Activity, { className: "w-4.5 h-4.5 text-primary" }), "Patch Impact Analysis"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs", children: [_jsxs("div", { className: "p-3.5 rounded-xl bg-surface/60 border border-border space-y-1", children: [_jsxs("span", { className: "text-emerald-400 font-bold flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " 100% Non-destructive"] }), _jsx("p", { className: "text-muted text-[11px]", children: "Audio waveform & video frames remain completely intact." })] }), _jsxs("div", { className: "p-3.5 rounded-xl bg-surface/60 border border-border space-y-1", children: [_jsxs("span", { className: "text-primary font-bold flex items-center gap-1", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " Instant Versioning"] }), _jsxs("p", { className: "text-muted text-[11px]", children: ["Automated rollback snapshot ", _jsx("strong", { className: "text-text", children: "v1.3" }), " created."] })] }), _jsxs("div", { className: "p-3.5 rounded-xl bg-surface/60 border border-border space-y-1", children: [_jsxs("span", { className: "text-purple-400 font-bold flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), " Zero Cloud Render"] }), _jsx("p", { className: "text-muted text-[11px]", children: "Saves ~1.5 hours of traditional MP4 re-exporting." })] })] })] }), _jsxs(motion.div, { variants: itemVariants, className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-bold text-text tracking-tight flex items-center gap-2", children: [_jsx(FileCode2, { className: "w-5 h-5 text-primary" }), "GitHub-Style Code & Text Diff"] }), _jsxs("span", { className: "text-xs font-mono text-muted", children: [MOCK_DIFFS.length, " files changed"] })] }), _jsx("div", { className: "space-y-4", children: MOCK_DIFFS.map(({ asset, filename, icon: Icon, changes }) => {
                            const isCollapsed = collapsedFiles[filename];
                            return (_jsxs("div", { className: "glass-card rounded-2xl border border-border overflow-hidden shadow-xl", children: [_jsxs("button", { type: "button", onClick: () => toggleFile(filename), className: "w-full flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface/80 hover:bg-white/[0.03] transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [isCollapsed ? (_jsx(ChevronRight, { className: "w-4 h-4 text-muted" })) : (_jsx(ChevronDown, { className: "w-4 h-4 text-muted" })), _jsx(Icon, { className: "w-4 h-4 text-primary" }), _jsx("span", { className: "text-sm font-bold text-text font-mono", children: filename }), _jsxs("span", { className: "text-xs text-muted font-normal", children: ["(", asset, ")"] })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs font-mono", children: [_jsxs("span", { className: "text-emerald-400", children: ["+", changes.length, " additions"] }), _jsxs("span", { className: "text-rose-400", children: ["-", changes.length, " deletions"] })] })] }), _jsx(AnimatePresence, { children: !isCollapsed && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "font-mono text-xs overflow-x-auto divide-y divide-border/30", children: changes.map((c, i) => (_jsxs("div", { className: "py-2 px-4 space-y-1", children: [_jsxs("div", { className: "flex items-start gap-3 text-rose-300 bg-rose-500/10 border-l-4 border-rose-500 px-3 py-1.5 rounded-r-lg", children: [_jsxs("span", { className: "w-8 text-muted/60 select-none text-[11px] shrink-0 text-right", children: ["L", c.line] }), _jsx("span", { className: "font-bold text-rose-400 shrink-0 select-none", children: "-" }), _jsx("span", { className: "break-all", children: c.removed })] }), _jsxs("div", { className: "flex items-start gap-3 text-emerald-300 bg-emerald-500/10 border-l-4 border-emerald-500 px-3 py-1.5 rounded-r-lg", children: [_jsxs("span", { className: "w-8 text-muted/60 select-none text-[11px] shrink-0 text-right", children: ["L", c.line] }), _jsx("span", { className: "font-bold text-emerald-400 shrink-0 select-none", children: "+" }), _jsx("span", { className: "break-all", children: c.added })] })] }, i))) })) })] }, filename));
                        }) })] }), _jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-surface to-card p-5 md:p-6 flex items-start gap-4 shadow-xl", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-glow", children: _jsx(AlertTriangle, { className: "w-5 h-5" }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "text-sm font-bold text-text flex items-center gap-2", children: "Safety & Scope Verification Notice" }), _jsxs("p", { className: "text-xs text-muted leading-relaxed", children: ["This patch targets ", _jsx("strong", { className: "text-text", children: "text-based asset files only" }), " (Transcripts, Captions, Descriptions, and Pinned Comments). No audio tracks or video frames are modified. Please double-check all diffs above before applying."] })] })] }), _jsxs(motion.div, { variants: itemVariants, className: "flex items-center justify-between pt-4 border-t border-border/50", children: [_jsxs("button", { type: "button", onClick: () => navigate(-1), className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " Back to Edit"] }), _jsxs(motion.button, { type: "button", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => navigate("/patch/apply"), className: "inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-bold text-sm shadow-glow transition-all active:scale-[0.98]", children: [_jsx(Sparkles, { className: "w-4.5 h-4.5" }), _jsx("span", { children: "Apply Patch (v1.3)" }), _jsx(ArrowRight, { className: "w-4.5 h-4.5" })] })] })] }));
}
