import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileCode2, Sparkles, Video, FileText, MessageSquare, Subtitles, CheckCircle2, ChevronRight, Wand2, X, LayoutTemplate, ArrowRight, } from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
const TEMPLATES = [
    { label: "Replace Product Name", prompt: "Replace every occurrence of [OldName] with [NewName]." },
    { label: "Update Sponsor", prompt: "Replace all sponsor mentions of [OldSponsor] with [NewSponsor]." },
    { label: "Replace Affiliate Link", prompt: "Update the affiliate link from [old-link] to [new-link]." },
    { label: "Correct Pricing", prompt: "Replace every instance of $[OldPrice]/mo with $[NewPrice]/mo." },
    { label: "Update Statistics", prompt: "Replace the statistic '[OldStat]' with '[NewStat]' throughout." },
    { label: "Update Company Name", prompt: "Replace all mentions of [OldCompany] with [NewCompany]." },
    { label: "Correct Dates", prompt: "Update all date references from [OldDate] to [NewDate]." },
];
const DETECTED_ASSETS = [
    { label: "Transcript", icon: FileText },
    { label: "Captions (.srt)", icon: Subtitles },
    { label: "Description", icon: FileText },
    { label: "Pinned Comment", icon: MessageSquare },
];
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { y: 14, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};
export default function CreatePatchPage() {
    const navigate = useNavigate();
    const { currentVideoTitle, currentVideoId, setPatchCommand } = usePatchStore();
    const [prompt, setPrompt] = useState("");
    const [focused, setFocused] = useState(false);
    const handleAnalyze = () => {
        if (!prompt.trim())
            return;
        setPatchCommand(prompt.trim());
        navigate("/patch/preview");
    };
    return (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "max-w-4xl mx-auto space-y-8 pb-16", children: [_jsxs(motion.div, { variants: itemVariants, className: "space-y-2", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary", children: [_jsx(FileCode2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Create Patch" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-text tracking-tight", children: "Define Your Patch" }), _jsx("p", { className: "text-muted text-sm md:text-base", children: "Describe the change you want to apply across all video assets." })] }), _jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl p-4 border border-border flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0", children: _jsx(Video, { className: "w-5 h-5" }) }), _jsxs("div", { className: "truncate", children: [_jsx("p", { className: "text-xs text-muted font-semibold uppercase tracking-wider", children: "Patching Video" }), _jsx("p", { className: "text-sm font-bold text-text truncate", children: currentVideoTitle })] }), _jsxs("span", { className: "ml-auto px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-surface text-muted border border-border shrink-0", children: ["ID: ", currentVideoId] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(motion.div, { variants: itemVariants, className: "lg:col-span-2 space-y-4", children: [_jsxs("div", { className: "glass-card rounded-2xl border border-border p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Wand2, { className: "w-5 h-5 text-primary" }), _jsx("h2", { className: "font-bold text-text", children: "Patch Command" })] }), _jsx(motion.div, { animate: {
                                            boxShadow: focused
                                                ? "0 0 0 2px rgba(124, 58, 237, 0.4)"
                                                : "0 0 0 1px rgba(255, 255, 255, 0.08)",
                                        }, className: "rounded-xl overflow-hidden", children: _jsx("textarea", { rows: 6, value: prompt, onChange: (e) => setPrompt(e.target.value), onFocus: () => setFocused(true), onBlur: () => setFocused(false), placeholder: 'Replace every occurrence of "GPT-4" with "GPT-5".', className: "w-full p-4 bg-card text-text text-sm placeholder:text-muted/50 focus:outline-none resize-none border-0" }) }), _jsxs("div", { className: "flex items-center justify-between pt-2", children: [_jsxs("span", { className: "text-xs text-muted font-mono", children: [prompt.length, " characters"] }), prompt && (_jsxs("button", { onClick: () => setPrompt(""), className: "text-xs text-muted hover:text-danger flex items-center gap-1 transition", children: [_jsx(X, { className: "w-3.5 h-3.5" }), " Clear"] }))] })] }), _jsxs("div", { className: "glass-card rounded-2xl border border-border p-6 space-y-4", children: [_jsxs("h2", { className: "font-bold text-text flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-400" }), "Detected Assets"] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: DETECTED_ASSETS.map(({ label, icon: Icon }) => (_jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20", children: [_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400 shrink-0" }), _jsx("span", { className: "text-sm font-medium text-text", children: label })] }, label))) })] })] }), _jsx(motion.div, { variants: itemVariants, className: "space-y-4", children: _jsxs("div", { className: "glass-card rounded-2xl border border-border p-5 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(LayoutTemplate, { className: "w-4 h-4 text-primary" }), _jsx("h2", { className: "font-bold text-text text-sm", children: "Command Templates" })] }), _jsx("p", { className: "text-xs text-muted", children: "Click a template to fill the editor." }), _jsx("div", { className: "space-y-2", children: TEMPLATES.map((t) => (_jsxs(motion.button, { whileHover: { x: 3 }, onClick: () => setPrompt(t.prompt), className: "w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-text hover:bg-white/5 border border-transparent hover:border-border transition-all flex items-center justify-between group", children: [_jsx("span", { children: t.label }), _jsx(ChevronRight, { className: "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary transition" })] }, t.label))) })] }) })] }), _jsxs(motion.div, { variants: itemVariants, className: "flex items-center justify-end gap-4 pt-4 border-t border-border/50", children: [_jsx("button", { onClick: () => navigate(-1), className: "px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition", children: "Cancel" }), _jsxs(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, disabled: !prompt.trim(), onClick: handleAnalyze, className: `inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-glow ${prompt.trim()
                            ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white"
                            : "bg-surface text-muted border border-border opacity-50 cursor-not-allowed"}`, children: [_jsx(Sparkles, { className: "w-4 h-4" }), "Analyze Patch", _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] }));
}
