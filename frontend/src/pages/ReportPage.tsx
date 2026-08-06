import React from "react";
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
  History,
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
    { asset: "Transcript", version: "v1.3", status: "Applied", changes: 8 },
    { asset: "Captions (.srt)", version: "v1.3", status: "Applied", changes: 3 },
    { asset: "Description", version: "v1.3", status: "Applied", changes: 2 },
    { asset: "Pinned Comment", version: "v1.3", status: "Applied", changes: 1 },
  ],
};

export default function ReportPage() {
  const { patchReport, currentVideoTitle, patchHistory } = usePatchStore();
  const report = patchReport || FALLBACK_REPORT;

  const latestPatch = patchHistory[patchHistory.length - 1];

  const handleExportJSON = () => {
    const data = JSON.stringify({ report, latestPatch }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patch-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    alert("PDF export is a mock — in production this would generate a real PDF.");
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Patch Report</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            Patch Analytics
          </h1>
          <p className="text-muted text-sm">
            Detailed report for <span className="text-text font-medium">{currentVideoTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-border text-muted hover:text-text hover:bg-white/10 font-medium text-sm transition"
          >
            <FileJson className="w-4 h-4 text-amber-400" />
            Export JSON
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-border text-muted hover:text-text hover:bg-white/10 font-medium text-sm transition"
          >
            <FileText className="w-4 h-4 text-red-400" />
            Export PDF
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white font-semibold text-sm shadow-glow transition-all"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Assets Updated",
            value: report.assetsUpdated,
            icon: Layers,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          },
          {
            label: "Occurrences Changed",
            value: report.occurrencesChanged,
            icon: FileText,
            color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          },
          {
            label: "Processing Time",
            value: report.processingTime,
            icon: Clock,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          },
          {
            label: "Patch Success",
            value: report.patchSuccess ? "✓ Yes" : "✗ Failed",
            icon: CheckCircle2,
            color: report.patchSuccess
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-danger bg-danger/10 border-danger/20",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5 border border-border flex flex-col space-y-3">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-text">{value}</p>
              <p className="text-xs text-muted font-medium">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Patch Command */}
      {latestPatch && (
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl border border-primary/25 bg-primary/5 p-5 flex items-start gap-3"
        >
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Patch Command Applied</p>
            <p className="text-sm text-text font-medium">{latestPatch.command}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted">
              <span>Version: <span className="text-text font-semibold font-mono">{latestPatch.version}</span></span>
              <span>Author: <span className="text-text font-semibold">{latestPatch.author}</span></span>
              <span>Applied: <span className="text-text font-semibold">{latestPatch.date}</span></span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Report Table */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <h2 className="text-base font-bold text-text flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Asset Breakdown
          </h2>
          <span className="text-xs text-muted font-mono">{report.table.length} assets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card/40">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Asset</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Version</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Status</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-muted px-6 py-3">Changes</th>
              </tr>
            </thead>
            <tbody>
              {report.table.map((row, idx) => (
                <motion.tr
                  key={row.asset}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.06 }}
                  className="border-b border-border/50 hover:bg-white/[0.02] transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-muted shrink-0" />
                      <span className="font-medium text-text">{row.asset}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold text-muted bg-surface px-2 py-0.5 rounded border border-border">
                      {row.version}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-text font-bold">{row.changes}</span>
                    <span className="text-muted ml-1 text-xs">occurrences</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Footer Navigation */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-border text-muted hover:text-text hover:bg-white/10 font-medium text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
        <Link
          to="/create-patch"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white font-semibold text-sm shadow-glow transition-all"
        >
          <Sparkles className="w-4 h-4" /> Create Another Patch
        </Link>
      </motion.div>
    </motion.div>
  );
}
