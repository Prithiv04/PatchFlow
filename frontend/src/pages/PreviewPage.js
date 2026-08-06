import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileCode2, AlertTriangle, CheckCircle2, Clock, Layers, Target, Zap, FileText, MessageSquare, Subtitles, } from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
const MOCK_DIFFS = [
    {
        asset: "Transcript",
        icon: FileText,
        changes: [
            { removed: "Built using GPT-4 for summarization.", added: "Built using GPT-5 for summarization." },
            { removed: "GPT-4 processes the audio in real time.", added: "GPT-5 processes the audio in real time." },
            { removed: "This GPT-4 integration reduces latency.", added: "This GPT-5 integration reduces latency." },
        ],
    },
    {
        asset: "Captions (.srt)",
        icon: Subtitles,
        changes: [
            { removed: "with GPT-4", added: "with GPT-5" },
            { removed: "powered by GPT-4", added: "powered by GPT-5" },
        ],
    },
    {
        asset: "Description",
        icon: FileText,
        changes: [
            { removed: "Built using GPT-4 API integration.", added: "Built using GPT-5 API integration." },
        ],
    },
    {
        asset: "Pinned Comment",
        icon: MessageSquare,
        changes: [
            { removed: "GPT-4 tutorial series — Episode 3", added: "GPT-5 tutorial series — Episode 3" },
        ],
    },
];
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { y: 14, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};
export default function PreviewPage() {
    const navigate = useNavigate();
    const { currentPatchCommand, currentVideoTitle } = usePatchStore();
    const totalOccurrences = MOCK_DIFFS.reduce((acc, d) => acc + d.changes.length, 0);
    return (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "max-w-5xl mx-auto space-y-8 pb-16", children: [_jsxs(motion.div, { variants: itemVariants, className: "space-y-2", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary", children: [_jsx(FileCode2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Patch Preview" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-text tracking-tight", children: "Review Your Patch" }), _jsxs("p", { className: "text-muted text-sm", children: ["AI-simulated diff preview for ", _jsx("span", { className: "text-text font-medium", children: currentVideoTitle }), "."] })] }), currentPatchCommand && (_jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-xl p-4 border border-primary/30 bg-primary/5 flex items-start gap-3", children: [_jsx(Zap, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-muted uppercase tracking-wider mb-1", children: "Patch Command" }), _jsx("p", { className: "text-sm text-text font-medium", children: currentPatchCommand })] })] })), _jsx(motion.div, { variants: itemVariants, className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    { label: "Assets Affected", value: MOCK_DIFFS.length, icon: Layers, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                    { label: "Occurrences", value: totalOccurrences, icon: Target, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                    { label: "Confidence", value: "98.4%", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                    { label: "Est. Time", value: "~4s", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                ].map(({ label, value, icon: Icon, color }) => (_jsxs("div", { className: "glass-card rounded-2xl p-5 border border-border flex flex-col space-y-3", children: [_jsx("div", { className: `w-9 h-9 rounded-xl border flex items-center justify-center ${color}`, children: _jsx(Icon, { className: "w-4.5 h-4.5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-extrabold text-text", children: value }), _jsx("p", { className: "text-xs text-muted font-medium", children: label })] })] }, label))) }), _jsxs(motion.div, { variants: itemVariants, className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-bold text-text", children: "Diff Preview" }), MOCK_DIFFS.map(({ asset, icon: Icon, changes }) => (_jsxs("div", { className: "glass-card rounded-2xl border border-border overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-3.5 border-b border-border bg-surface/50", children: [_jsx(Icon, { className: "w-4 h-4 text-primary" }), _jsx("span", { className: "text-sm font-bold text-text", children: asset }), _jsxs("span", { className: "ml-auto text-xs text-muted font-mono", children: [changes.length, " change", changes.length > 1 ? "s" : ""] })] }), _jsx("div", { className: "p-4 space-y-3 font-mono text-xs", children: changes.map((c, i) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-start gap-2 text-danger bg-danger/5 border border-danger/15 rounded-lg px-3 py-2", children: [_jsx("span", { className: "font-bold text-danger shrink-0", children: "\u2212" }), _jsx("span", { className: "text-danger/90", children: c.removed })] }), _jsxs("div", { className: "flex items-start gap-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2", children: [_jsx("span", { className: "font-bold text-emerald-400 shrink-0", children: "+" }), _jsx("span", { className: "text-emerald-400/90", children: c.added })] })] }, i))) })] }, asset)))] }), _jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl border border-warning/30 bg-warning/5 p-5 flex items-start gap-4", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-warning shrink-0 mt-0.5" }), _jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "text-sm font-bold text-text", children: "Patch Notice" }), _jsxs("p", { className: "text-xs text-muted leading-relaxed", children: ["This patch changes ", _jsx("strong", { className: "text-text", children: "text content only" }), ". Audio tracks and video frames remain entirely unchanged. Verify the diff carefully before applying to avoid unintended context shifts."] })] })] }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-border/50", children: [_jsxs("button", { onClick: () => navigate(-1), className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " Back"] }), _jsxs(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => navigate("/patch/apply"), className: "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white font-semibold text-sm shadow-glow transition-all", children: ["Apply Patch ", _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] }));
}
