import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  Download,
  FileJson,
  FileText,
  Layers,
  Clock,
  Sparkles,
  ArrowLeft,
  Zap,
  ShieldCheck,
  TrendingUp,
  Target,
  Activity,
  FileCode2,
  User,
  Calendar,
  Check,
} from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

const FALLBACK_REPORT = {
  assetsUpdated: 4,
  occurrencesChanged: 14,
  processingTime: "3.8s",
  patchSuccess: true,
  table: [
    { asset: "Transcript", format: "TXT", version: "v1.3", status: "Applied", changes: 8, confidence: 99.2 },
    { asset: "Captions (.srt)", format: "SRT", version: "v1.3", status: "Applied", changes: 3, confidence: 98.5 },
    { asset: "Description", format: "MD", version: "v1.3", status: "Applied", changes: 2, confidence: 97.9 },
    { asset: "Pinned Comment", format: "JSON", version: "v1.3", status: "Applied", changes: 1, confidence: 98.1 },
  ],
};

export default function ReportPage() {
  const { patchReport, currentVideoTitle, patchHistory } = usePatchStore();
  const report = patchReport
    ? {
        ...patchReport,
        table: patchReport.table.map((r, i) => ({
          ...r,
          format: ["TXT", "SRT", "MD", "JSON"][i % 4],
          confidence: [99.2, 98.5, 97.9, 98.1][i % 4],
        })),
      }
    : FALLBACK_REPORT;

  const latestPatch = patchHistory[patchHistory.length - 1];
  const [jsonCopied, setJsonCopied] = useState(false);

  const handleExportJSON = () => {
    const data = JSON.stringify({ report, latestPatch }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patchflow-report.json";
    a.click();
    URL.revokeObjectURL(url);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2500);
  };

  const handleExportPDF = () => {
    alert("PDF export — in production this would generate a real PDF report.");
  };

  const totalOccurrences = report.table.reduce((s, r) => s + r.changes, 0);
  const avgConfidence = (
    report.table.reduce((s, r) => s + (r as any).confidence, 0) / report.table.length
  ).toFixed(1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8 pb-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-glow">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Patch Analytics Report</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            Patch Report
          </h1>
          <p className="text-muted text-sm">
            Full diff analysis for{" "}
            <span className="text-text font-semibold">{currentVideoTitle}</span>
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 text-muted hover:text-amber-400 font-medium text-sm transition-all"
          >
            {jsonCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <FileJson className="w-4 h-4 text-amber-400" />
            )}
            <span>{jsonCopied ? "Downloaded!" : "Export JSON"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/10 text-muted hover:text-rose-400 font-medium text-sm transition-all"
          >
            <FileText className="w-4 h-4 text-rose-400" />
            Export PDF
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-semibold text-sm shadow-glow transition-all"
          >
            <Download className="w-4 h-4" />
            Download Report
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Analytics Cards — 4 Column Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Assets Updated",
            value: report.assetsUpdated,
            detail: "All 4 files patched",
            icon: Layers,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500",
          },
          {
            label: "Occurrences Changed",
            value: totalOccurrences,
            detail: "Text matches replaced",
            icon: Target,
            color: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500",
          },
          {
            label: "Processing Time",
            value: report.processingTime,
            detail: "Zero re-render cost",
            icon: Clock,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500",
          },
          {
            label: "Patch Outcome",
            value: report.patchSuccess ? "Success" : "Failed",
            detail: report.patchSuccess ? "Applied cleanly" : "Review required",
            icon: report.patchSuccess ? CheckCircle2 : Activity,
            color: report.patchSuccess
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500"
              : "text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500",
          },
        ].map(({ label, value, detail, icon: Icon, color }) => (
          <motion.div
            key={label}
            whileHover={{ y: -3 }}
            className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between space-y-3 h-full group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</span>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all group-hover:text-white ${color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-text tracking-tight">{value}</p>
              <p className="text-[11px] text-muted/80 mt-1">{detail}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Secondary Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">Avg Confidence</p>
            <p className="text-2xl font-extrabold text-text">{avgConfidence}%</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">Hours Saved</p>
            <p className="text-2xl font-extrabold text-text">~1.5h</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold">Version Created</p>
            <p className="text-2xl font-extrabold text-primary font-mono">v1.3</p>
          </div>
        </div>
      </motion.div>

      {/* Patch Command Banner */}
      {latestPatch && (
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-surface to-card p-5 md:p-6 space-y-3 shadow-xl"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Applied Patch Command
          </div>

          <div className="font-mono text-xs md:text-sm bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-text/90 break-all">
            "{latestPatch.command}"
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-primary" />
              Version: <span className="text-text font-bold font-mono ml-1">{latestPatch.version}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              Author: <span className="text-text font-semibold ml-1">{latestPatch.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Applied: <span className="text-text font-semibold ml-1">{latestPatch.date}</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Asset Breakdown Table */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <h2 className="text-base font-bold text-text flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-primary" />
            Asset Breakdown Table
          </h2>
          <span className="text-xs text-muted font-mono bg-surface border border-border px-2.5 py-1 rounded-lg">
            {report.table.length} assets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card/40">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3">Asset</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3">Format</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3">Version</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3">Confidence</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-muted px-5 py-3">Changes</th>
              </tr>
            </thead>
            <tbody>
              {report.table.map((row, idx) => {
                const conf = (row as any).confidence as number;
                const fmt = (row as any).format as string;
                return (
                  <motion.tr
                    key={row.asset}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.06 }}
                    className="border-b border-border/50 hover:bg-white/[0.025] transition"
                  >
                    {/* Asset Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-muted shrink-0" />
                        <span className="font-semibold text-text">{row.asset}</span>
                      </div>
                    </td>

                    {/* Format */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] font-semibold bg-surface text-muted border border-border px-2 py-0.5 rounded">
                        .{fmt?.toLowerCase()}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                        {row.version}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {row.status}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-surface overflow-hidden border border-border">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                            style={{ width: `${conf}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold text-emerald-400">{conf}%</span>
                      </div>
                    </td>

                    {/* Changes */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-text font-extrabold text-base">{row.changes}</span>
                      <span className="text-muted ml-1 text-xs">replacements</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>

            {/* Table Footer Totals */}
            <tfoot>
              <tr className="bg-surface/60 border-t border-primary/20">
                <td colSpan={5} className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">
                  Total Replacements
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-lg font-extrabold text-primary">{totalOccurrences}</span>
                  <span className="text-muted ml-1 text-xs">replacements</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* Footer Navigation */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-border text-muted hover:text-text hover:bg-white/10 font-medium text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
        <Link
          to="/create-patch"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-semibold text-sm shadow-glow transition-all"
        >
          <Sparkles className="w-4 h-4" /> Create Another Patch
        </Link>
      </motion.div>
    </motion.div>
  );
}
