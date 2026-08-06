import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  History,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  FileCode2,
  User,
  Calendar,
  FileText,
  Layers,
  ArrowUpRight,
  Plus,
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

export default function HistoryPage() {
  const { patchHistory, currentVideoTitle } = usePatchStore();
  const [expanded, setExpanded] = useState<string | null>(patchHistory[patchHistory.length - 1]?.id ?? null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8 pb-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <History className="w-3.5 h-3.5" />
          <span>Version History</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
              Patch Timeline
            </h1>
            <p className="text-muted text-sm mt-1">
              All patch versions for <span className="text-text font-medium">{currentVideoTitle}</span>
            </p>
          </div>
          <Link
            to="/create-patch"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white font-semibold text-sm shadow-glow transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> New Patch
          </Link>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants} className="relative">
        {/* Vertical connector */}
        <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/40 via-border to-transparent" />

        <div className="space-y-4">
          {patchHistory.map((entry, idx) => {
            const isLatest = idx === patchHistory.length - 1;
            const isExpanded = expanded === entry.id;
            const isOriginal = entry.occurrences === 0;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="relative pl-12"
              >
                {/* Timeline Node */}
                <div
                  className={`absolute left-3.5 top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isLatest
                      ? "bg-primary border-primary shadow-glow"
                      : isOriginal
                      ? "bg-surface border-border"
                      : "bg-emerald-500 border-emerald-500"
                  }`}
                >
                  {isLatest && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                </div>

                {/* Version Label */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isLatest
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-surface text-muted border border-border"
                    }`}
                  >
                    {entry.version}
                  </span>
                  {isLatest && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Latest
                    </span>
                  )}
                </div>

                {/* Expandable Card */}
                <div className="glass-card rounded-2xl border border-border overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : entry.id)}
                    className="w-full text-left flex items-center justify-between p-4 hover:bg-white/[0.02] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isOriginal
                            ? "bg-surface text-muted border border-border"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                        }`}
                      >
                        {isOriginal ? (
                          <Layers className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text">
                          {isOriginal ? "Original Upload" : `Patch #${idx}`}
                        </p>
                        <p className="text-xs text-muted truncate max-w-xs">
                          {isOriginal ? "Initial video asset — no patches applied" : entry.summary}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted shrink-0" />
                    )}
                  </button>

                  {isExpanded && !isOriginal && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border p-4 space-y-4"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-muted" />
                          <span className="text-muted">Date:</span>
                          <span className="text-text font-medium">{entry.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-muted" />
                          <span className="text-muted">Author:</span>
                          <span className="text-text font-medium">{entry.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileCode2 className="w-3.5 h-3.5 text-muted" />
                          <span className="text-muted">Occurrences:</span>
                          <span className="text-text font-medium">{entry.occurrences}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-card border border-border">
                        <p className="text-xs font-mono text-muted/70 mb-1">Command</p>
                        <p className="text-xs font-medium text-text">{entry.command}</p>
                      </div>

                      {entry.assetsAffected.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.assetsAffected.map((a) => (
                            <span
                              key={a}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-primary/10 text-primary border border-primary/20"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        to="/report"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-purple-300 transition"
                      >
                        View Report <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
