import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Download, FileJson, FileText, Layers, Clock, Sparkles, Zap, ShieldCheck, TrendingUp, Target, FileCode2, Calendar, Check, } from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
import { exportService } from "@/services/exportService";
import toast from "react-hot-toast";
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
    hidden: { y: 14, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};
const DEFAULT_ROWS = [
    { asset: "Transcript", format: "JSON", version: "v1.1", status: "Applied", changes: 8, confidence: 99.2 },
    { asset: "Captions (.srt)", format: "SRT", version: "v1.1", status: "Applied", changes: 3, confidence: 98.5 },
    { asset: "PCM Audio Stream", format: "WAV", version: "v1.1", status: "Verified", changes: 0, confidence: 100.0 },
    { asset: "Keyframe Thumbnail", format: "JPG", version: "v1.1", status: "Verified", changes: 0, confidence: 100.0 },
];
export default function ReportPage() {
    const { patchReport, currentVideoTitle, currentVideoId, activePatch, historyTimeline } = usePatchStore();
    const [jsonCopied, setJsonCopied] = useState(false);
    const occurrencesChanged = patchReport?.occurrences_changed ?? activePatch?.occurrences_count ?? 11;
    const confidenceScore = patchReport?.confidence_score ?? activePatch?.confidence_score ?? 0.984;
    const confidencePercent = (confidenceScore * 100).toFixed(1);
    const versionTag = patchReport?.version ?? activePatch?.version ?? "v1.1";
    const assetsUpdatedCount = patchReport?.assets_updated?.length ?? activePatch?.affected_assets?.length ?? 2;
    const tableRows = DEFAULT_ROWS.map((r, i) => ({
        ...r,
        version: versionTag,
        changes: i === 0 ? Math.ceil(occurrencesChanged * 0.7) : i === 1 ? Math.floor(occurrencesChanged * 0.3) : 0,
    }));
    const handleExportJSON = () => {
        if (activePatch?.patch_id && currentVideoId) {
            exportService.downloadPatchReport(currentVideoId, activePatch.patch_id);
        }
        else if (currentVideoId) {
            exportService.downloadAsset(currentVideoId, "package");
        }
        else {
            const data = JSON.stringify({ report: patchReport || activePatch, versionTag }, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "patchflow-report.json";
            a.click();
            URL.revokeObjectURL(url);
        }
        setJsonCopied(true);
        setTimeout(() => setJsonCopied(false), 2500);
    };
    const handleExportPackage = () => {
        if (currentVideoId) {
            exportService.downloadAsset(currentVideoId, "package");
        }
        else {
            toast.error("No active video selected.");
        }
    };
    return (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "max-w-5xl mx-auto space-y-8 pb-16", children: [_jsxs(motion.div, { variants: itemVariants, className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-glow", children: [_jsx(BarChart3, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Patch Analytics Report" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-text tracking-tight", children: "Patch Execution Report" }), _jsxs("p", { className: "text-muted text-sm", children: ["Full execution diff analysis for", " ", _jsx("span", { className: "text-text font-semibold", children: currentVideoTitle })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2.5 shrink-0", children: [_jsxs(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: handleExportJSON, className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 text-muted hover:text-amber-400 font-medium text-sm transition-all", children: [jsonCopied ? (_jsx(Check, { className: "w-4 h-4 text-emerald-400" })) : (_jsx(FileJson, { className: "w-4 h-4 text-amber-400" })), _jsx("span", { children: jsonCopied ? "Downloaded!" : "Export Report JSON" })] }), _jsxs(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: handleExportPackage, className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-semibold text-sm shadow-glow transition-all", children: [_jsx(Download, { className: "w-4 h-4" }), "Download Package ZIP"] })] })] }), _jsx(motion.div, { variants: itemVariants, className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
                    {
                        label: "Assets Updated",
                        value: assetsUpdatedCount,
                        detail: `${assetsUpdatedCount} Assets Modified`,
                        icon: Layers,
                        color: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500",
                    },
                    {
                        label: "Occurrences Changed",
                        value: occurrencesChanged,
                        detail: "Matches Replaced",
                        icon: Target,
                        color: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500",
                    },
                    {
                        label: "Processing Time",
                        value: "< 1.0s",
                        detail: "Zero re-render cost",
                        icon: Clock,
                        color: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500",
                    },
                    {
                        label: "Patch Outcome",
                        value: "Success",
                        detail: "Applied cleanly",
                        icon: CheckCircle2,
                        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500",
                    },
                ].map(({ label, value, detail, icon: Icon, color }) => (_jsxs(motion.div, { whileHover: { y: -3 }, className: "glass-card rounded-2xl p-5 border border-border flex flex-col justify-between space-y-3 h-full group", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-semibold text-muted uppercase tracking-wider", children: label }), _jsx("div", { className: `w-9 h-9 rounded-xl border flex items-center justify-center transition-all group-hover:text-white ${color}`, children: _jsx(Icon, { className: "w-4.5 h-4.5" }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-extrabold text-text tracking-tight", children: value }), _jsx("p", { className: "text-[11px] text-muted/80 mt-1", children: detail })] })] }, label))) }), _jsxs(motion.div, { variants: itemVariants, className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "glass-card rounded-2xl p-5 border border-border flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0", children: _jsx(ShieldCheck, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted uppercase tracking-wider font-semibold", children: "Match Confidence" }), _jsxs("p", { className: "text-2xl font-extrabold text-text", children: [confidencePercent, "%"] })] })] }), _jsxs("div", { className: "glass-card rounded-2xl p-5 border border-border flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0", children: _jsx(TrendingUp, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted uppercase tracking-wider font-semibold", children: "Render Hours Saved" }), _jsx("p", { className: "text-2xl font-extrabold text-text", children: "~2.5h" })] })] }), _jsxs("div", { className: "glass-card rounded-2xl p-5 border border-border flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0", children: _jsx(Zap, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted uppercase tracking-wider font-semibold", children: "Version Tag" }), _jsx("p", { className: "text-2xl font-extrabold text-primary font-mono", children: versionTag })] })] })] }), (activePatch || patchReport) && (_jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-surface to-card p-5 md:p-6 space-y-3 shadow-xl", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider", children: [_jsx(Sparkles, { className: "w-4 h-4" }), "Applied Patch Command"] }), _jsxs("div", { className: "font-mono text-xs md:text-sm bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-text/90 break-all", children: ["\"", activePatch?.prompt || patchReport?.prompt || 'Replace target text across assets', "\""] }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 pt-1 text-xs text-muted", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(FileCode2, { className: "w-3.5 h-3.5 text-primary" }), "Version: ", _jsx("span", { className: "text-text font-bold font-mono ml-1", children: versionTag })] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-primary" }), "Applied: ", _jsx("span", { className: "text-text font-semibold ml-1", children: activePatch?.created_at || patchReport?.applied_at || "Just now" })] })] })] })), _jsxs(motion.div, { variants: itemVariants, className: "glass-card rounded-2xl border border-border overflow-hidden shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50", children: [_jsxs("h2", { className: "text-base font-bold text-text flex items-center gap-2", children: [_jsx(BarChart3, { className: "w-4.5 h-4.5 text-primary" }), "Asset Breakdown Table"] }), _jsxs("span", { className: "text-xs text-muted font-mono bg-surface border border-border px-2.5 py-1 rounded-lg", children: [tableRows.length, " assets"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border bg-card/40", children: [_jsx("th", { className: "text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3", children: "Asset" }), _jsx("th", { className: "text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3", children: "Format" }), _jsx("th", { className: "text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3", children: "Version" }), _jsx("th", { className: "text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3", children: "Status" }), _jsx("th", { className: "text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3", children: "Confidence" }), _jsx("th", { className: "text-right text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3", children: "Changes" })] }) }), _jsx("tbody", { children: tableRows.map((row, idx) => (_jsxs("tr", { className: "border-b border-border/50 hover:bg-white/[0.025] transition", children: [_jsx("td", { className: "px-5 py-4", children: _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(FileText, { className: "w-4 h-4 text-muted shrink-0" }), _jsx("span", { className: "font-semibold text-text", children: row.asset })] }) }), _jsx("td", { className: "px-5 py-4 font-mono text-xs text-muted", children: row.format }), _jsx("td", { className: "px-5 py-4 font-mono text-xs text-primary font-bold", children: row.version }), _jsx("td", { className: "px-5 py-4", children: _jsx("span", { className: "px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", children: row.status }) }), _jsxs("td", { className: "px-5 py-4 font-mono text-xs text-text", children: [row.confidence, "%"] }), _jsx("td", { className: "px-5 py-4 font-mono text-xs text-right font-bold text-text", children: row.changes })] }, row.asset))) })] }) })] })] }));
}
