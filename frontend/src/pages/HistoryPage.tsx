import React, { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  History,
  ChevronDown,
  ChevronRight,
  FileCode2,
  Plus,
  RotateCcw,
  BarChart3,
  Zap,
  Loader2,
  AlertCircle,
  Film,
} from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
import { patchService } from "@/services/patchService";
import { exportService } from "@/services/exportService";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

export default function HistoryPage() {
  const { currentVideoId, currentVideoTitle, historyTimeline, fetchHistory, fetchTranscript, isLoading, error } = usePatchStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [revertingId, setRevertingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentVideoId) {
      fetchHistory(currentVideoId);
    }
  }, [currentVideoId, fetchHistory]);

  const timeline = Array.isArray(historyTimeline) ? historyTimeline : [];

  const handleRevert = async (patchId: string) => {
    if (!currentVideoId) return;
    try {
      setRevertingId(patchId);
      await patchService.revertPatch(currentVideoId, patchId);
      toast.success("Patch reverted successfully! Asset restored to previous state.");
      await Promise.all([fetchHistory(currentVideoId), fetchTranscript(currentVideoId)]);
    } catch (err: any) {
      toast.error(err.message || "Failed to revert patch");
    } finally {
      setRevertingId(null);
    }
  };

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
          <span>Live Version Timeline</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
              Patch History &amp; Versions
            </h1>
            <p className="text-muted text-sm mt-1">
              All patch versions and rollback states for{" "}
              <span className="text-text font-semibold">{currentVideoTitle || "Uploaded Video"}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-muted bg-surface border border-border px-2.5 py-1 rounded-lg">
              {timeline.length} versions
            </span>
            <Link
              to="/create-patch"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white font-semibold text-sm shadow-glow transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> New Patch
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-12 border border-border flex flex-col items-center justify-center space-y-4 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-text">Loading version history...</p>
        </motion.div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8 border border-rose-500/30 bg-rose-500/5 space-y-3 text-center">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-text">Unable to load version history</h2>
          <p className="text-xs text-muted max-w-md mx-auto">{error}</p>
        </motion.div>
      )}

      {/* No Video Selected */}
      {!isLoading && !error && !currentVideoId && (
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-12 border border-border flex flex-col items-center justify-center space-y-4 text-center">
          <Film className="w-10 h-10 text-primary opacity-60" />
          <h2 className="text-lg font-bold text-text">No active video selected</h2>
          <p className="text-xs text-muted max-w-md">Please import or select a video asset to view its patch timeline history.</p>
          <Link
            to="/import"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-semibold shadow-glow"
          >
            Import Video Asset
          </Link>
        </motion.div>
      )}

      {/* Empty Timeline State */}
      {!isLoading && !error && currentVideoId && timeline.length === 0 && (
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-12 border border-border flex flex-col items-center justify-center space-y-4 text-center">
          <History className="w-10 h-10 text-muted opacity-60" />
          <h2 className="text-lg font-bold text-text">No versions recorded yet</h2>
          <p className="text-xs text-muted max-w-md">Create your first patch to build out the version history timeline for this video asset.</p>
          <Link
            to="/create-patch"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-semibold shadow-glow"
          >
            Create First Patch
          </Link>
        </motion.div>
      )}

      {/* Timeline List */}
      {!isLoading && !error && timeline.length > 0 && (
        <motion.div variants={itemVariants} className="relative">
          {/* Vertical connector */}
          <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/60 via-border/60 to-transparent" />

          <div className="space-y-5">
            {timeline.map((entry, idx) => {
              const isLatest = idx === timeline.length - 1;
              const patchId = entry.patch_id || (entry.id && entry.id !== "original" ? entry.id : null);
              const entryKey = patchId || `v-${entry.version || idx}`;
              const isExpanded = expanded === entryKey;
              const isOriginal = entry.type === "initial_upload" || entry.status === "original" || entry.id === "original";
              const isReverted = entry.status === "reverted";
              const promptText = entry.prompt || entry.command || entry.summary || "Baseline Version";
              const timestamp = entry.applied_at || entry.date || "";
              const occurrences = entry.occurrences_changed ?? entry.occurrences ?? 0;
              const typeLabel = entry.type || (isOriginal ? "initial_upload" : "patch");

              return (
                <motion.div
                  key={entryKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative pl-12"
                >
                  {/* Timeline node */}
                  <div
                    className={`absolute left-2.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center border text-xs shadow-glow transition-all ${
                      isLatest
                        ? "bg-primary text-white border-primary ring-4 ring-primary/20 scale-110"
                        : isReverted
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                        : "bg-surface text-muted border-border"
                    }`}
                  >
                    {isOriginal ? (
                      <FileCode2 className="w-3.5 h-3.5" />
                    ) : (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`glass-card rounded-2xl border transition-all ${isLatest ? "border-primary/40 shadow-glow" : "border-border"}`}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : entryKey)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-primary/20 text-primary border border-primary/30">
                            {entry.version}
                          </span>
                          {isLatest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Active Baseline
                            </span>
                          )}
                          {isReverted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Reverted
                            </span>
                          )}
                          {timestamp && <span className="text-xs text-muted font-mono">{timestamp}</span>}
                        </div>
                        <p className="font-bold text-text text-sm truncate">{promptText}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted font-medium hidden sm:inline-block">
                          {entry.author || "System User"}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted" />
                        )}
                      </div>
                    </button>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 pt-2 border-t border-border/50 space-y-4 text-xs"
                        >
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface p-3.5 rounded-xl border border-border">
                            <div>
                              <span className="text-muted block font-semibold">Changes</span>
                              <span className="font-mono text-text">{occurrences} matches</span>
                            </div>
                            <div>
                              <span className="text-muted block font-semibold">Author</span>
                              <span className="text-text">{entry.author || "System User"}</span>
                            </div>
                            <div>
                              <span className="text-muted block font-semibold">Status</span>
                              <span className="font-semibold text-emerald-400 capitalize">{entry.status}</span>
                            </div>
                            <div>
                              <span className="text-muted block font-semibold">Type</span>
                              <span className="font-mono text-primary uppercase">{typeLabel}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between gap-3 pt-2">
                            {patchId && currentVideoId && (
                              <button
                                onClick={() => exportService.downloadPatchReport(currentVideoId, patchId)}
                                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                              >
                                <BarChart3 className="w-3.5 h-3.5" /> Download Patch Report
                              </button>
                            )}
                            {patchId && entry.status === "applied" && (
                              <button
                                onClick={() => handleRevert(patchId)}
                                disabled={revertingId === patchId}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                {revertingId === patchId ? "Reverting..." : "Revert Patch"}
                              </button>
                            )}
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
      )}
    </motion.div>
  );
}
