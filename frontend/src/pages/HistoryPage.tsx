import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  History,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  FileCode2,
  User,
  Calendar,
  Layers,
  ArrowUpRight,
  Plus,
  Clock,
  ShieldCheck,
  Eye,
  RotateCcw,
  BarChart3,
  Zap,
  Tag,
} from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";

const MOCK_EXTRAS: Record<string, { confidence: number; processingTime: string }> = {
  "patch-h2": { confidence: 98.4, processingTime: "3.1s" },
  "patch-h3": { confidence: 96.7, processingTime: "2.4s" },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

export default function HistoryPage() {
  const { patchHistory, currentVideoTitle } = usePatchStore();
  const [expanded, setExpanded] = useState<string | null>(
    patchHistory[patchHistory.length - 1]?.id ?? null
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8 pb-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-glow">
          <History className="w-3.5 h-3.5" />
          <span>Version History</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
              Patch Timeline
            </h1>
            <p className="text-muted text-sm mt-1">
              All patch versions for{" "}
              <span className="text-text font-semibold">{currentVideoTitle}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-muted bg-surface border border-border px-2.5 py-1 rounded-lg">
              {patchHistory.length} versions
            </span>
            <Link
              to="/create-patch"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-semibold text-sm shadow-glow transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> New Patch
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants} className="relative">
        {/* Vertical connector */}
        <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/60 via-border/60 to-transparent" />

        <div className="space-y-5">
          {patchHistory.map((entry, idx) => {
            const isLatest = idx === patchHistory.length - 1;
            const isExpanded = expanded === entry.id;
            const isOriginal = entry.occurrences === 0;
            const extras = MOCK_EXTRAS[entry.id];

            // Dynamic confidence for any new patch entries (from Zustand)
            const confidence = extras?.confidence ?? 98.4;
            const processingTime = extras?.processingTime ?? "3.8s";

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="relative pl-12"
              >
                {/* Timeline Node */}
                <div
                  className={`absolute left-3.5 top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isLatest
                      ? "bg-primary border-primary shadow-glow"
                      : isOriginal
                      ? "bg-surface border-border/60"
                      : "bg-emerald-500 border-emerald-500"
                  }`}
                >
                  {isLatest && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </div>

                {/* Version Label Row */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                      isLatest
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-surface text-muted border border-border"
                    }`}
                  >
                    {entry.version}
                  </span>
                  {isLatest && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      Latest
                    </span>
                  )}
                  {isOriginal && (
                    <span className="text-[10px] font-medium text-muted">
                      Original Upload
                    </span>
                  )}
                  {!isOriginal && (
                    <span className="text-[11px] text-muted/70 font-mono">
                      {entry.date}
                    </span>
                  )}
                </div>

                {/* Main Expandable Card */}
                <div className="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
                  {/* Card Header / Click to Expand */}
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : entry.id)}
                    className="w-full text-left flex items-center justify-between p-4 md:p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isOriginal
                            ? "bg-surface text-muted border border-border"
                            : isLatest
                            ? "bg-primary/20 text-primary border border-primary/40 shadow-glow"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {isOriginal ? (
                          <Layers className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-text leading-tight">
                          {isOriginal ? "Original Upload" : `Patch #${idx} — ${entry.version}`}
                        </p>
                        <p className="text-xs text-muted truncate max-w-sm leading-snug">
                          {isOriginal
                            ? "Initial video asset — no patches applied"
                            : entry.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {!isOriginal && (
                        <span
                          className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            entry.status === "applied"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {entry.status === "applied" ? "Applied" : "Pending"}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && !isOriginal && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border overflow-hidden"
                      >
                        <div className="p-5 space-y-5">
                          {/* Metadata Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-xl bg-surface/60 border border-border space-y-1">
                              <span className="text-[10px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Timestamp
                              </span>
                              <p className="text-xs font-semibold text-text">{entry.date}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-surface/60 border border-border space-y-1">
                              <span className="text-[10px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                                <User className="w-3 h-3" /> Author
                              </span>
                              <p className="text-xs font-semibold text-text">{entry.author}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-surface/60 border border-border space-y-1">
                              <span className="text-[10px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Confidence
                              </span>
                              <p className="text-xs font-semibold text-emerald-400">{confidence}%</p>
                            </div>

                            <div className="p-3 rounded-xl bg-surface/60 border border-border space-y-1">
                              <span className="text-[10px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Process Time
                              </span>
                              <p className="text-xs font-semibold text-text">{processingTime}</p>
                            </div>
                          </div>

                          {/* Occurrences Row */}
                          <div className="flex items-center gap-3 text-xs">
                            <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-muted">Occurrences replaced:</span>
                            <span className="text-text font-bold">{entry.occurrences}</span>
                          </div>

                          {/* Patch Command */}
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                              <FileCode2 className="w-3 h-3 text-primary" /> Patch Command
                            </p>
                            <div className="font-mono text-xs bg-black/40 border border-white/10 px-3 py-2.5 rounded-xl text-text/90 break-all">
                              "{entry.command}"
                            </div>
                          </div>

                          {/* Asset Badges */}
                          {entry.assetsAffected.length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
                                <Tag className="w-3 h-3 text-primary" /> Assets Patched
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {entry.assetsAffected.map((a) => (
                                  <span
                                    key={a}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20"
                                  >
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons Row */}
                          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
                            {/* View Report */}
                            <Link
                              to="/report"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold transition-all"
                            >
                              <BarChart3 className="w-3.5 h-3.5" />
                              View Report
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>

                            {/* Preview Changes */}
                            <Link
                              to="/patch/preview"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-card hover:bg-white/10 text-text border border-border text-xs font-semibold transition-all"
                            >
                              <Eye className="w-3.5 h-3.5 text-primary" />
                              Preview Changes
                            </Link>

                            {/* Restore Version — Disabled */}
                            <button
                              type="button"
                              disabled
                              title="Restore is not available for the latest version"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface text-muted border border-border/50 text-xs font-semibold cursor-not-allowed opacity-40 select-none"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Restore Version
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
