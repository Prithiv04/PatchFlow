import React from "react";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  FileCode2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Target,
  Zap,
  FileText,
  MessageSquare,
  Subtitles,
} from "lucide-react";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

export default function PreviewPage() {
  const navigate = useNavigate();
  const { currentPatchCommand, currentVideoTitle } = usePatchStore();

  const totalOccurrences = MOCK_DIFFS.reduce((acc, d) => acc + d.changes.length, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8 pb-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Patch Preview</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
          Review Your Patch
        </h1>
        <p className="text-muted text-sm">
          AI-simulated diff preview for <span className="text-text font-medium">{currentVideoTitle}</span>.
        </p>
      </motion.div>

      {/* Patch Command Badge */}
      {currentPatchCommand && (
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-xl p-4 border border-primary/30 bg-primary/5 flex items-start gap-3"
        >
          <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Patch Command</p>
            <p className="text-sm text-text font-medium">{currentPatchCommand}</p>
          </div>
        </motion.div>
      )}

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Assets Affected", value: MOCK_DIFFS.length, icon: Layers, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { label: "Occurrences", value: totalOccurrences, icon: Target, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { label: "Confidence", value: "98.4%", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { label: "Est. Time", value: "~4s", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
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

      {/* Diff Viewer */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-lg font-bold text-text">Diff Preview</h2>
        {MOCK_DIFFS.map(({ asset, icon: Icon, changes }) => (
          <div key={asset} className="glass-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-surface/50">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-text">{asset}</span>
              <span className="ml-auto text-xs text-muted font-mono">{changes.length} change{changes.length > 1 ? "s" : ""}</span>
            </div>
            <div className="p-4 space-y-3 font-mono text-xs">
              {changes.map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-start gap-2 text-danger bg-danger/5 border border-danger/15 rounded-lg px-3 py-2">
                    <span className="font-bold text-danger shrink-0">−</span>
                    <span className="text-danger/90">{c.removed}</span>
                  </div>
                  <div className="flex items-start gap-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2">
                    <span className="font-bold text-emerald-400 shrink-0">+</span>
                    <span className="text-emerald-400/90">{c.added}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Warnings */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl border border-warning/30 bg-warning/5 p-5 flex items-start gap-4"
      >
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-text">Patch Notice</h3>
          <p className="text-xs text-muted leading-relaxed">
            This patch changes <strong className="text-text">text content only</strong>. Audio tracks and video frames remain
            entirely unchanged. Verify the diff carefully before applying to avoid unintended context shifts.
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/patch/apply")}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white font-semibold text-sm shadow-glow transition-all"
        >
          Apply Patch <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
