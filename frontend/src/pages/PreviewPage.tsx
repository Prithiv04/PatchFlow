import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
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
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Activity
} from "lucide-react";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

export default function PreviewPage() {
  const navigate = useNavigate();
  const { currentPatchCommand, currentVideoTitle } = usePatchStore();

  const [copied, setCopied] = useState(false);
  const [collapsedFiles, setCollapsedFiles] = useState<Record<string, boolean>>({});

  const displayCommand = currentPatchCommand?.trim() || 'Replace every occurrence of "GPT-4" with "GPT-5".';
  const totalOccurrences = MOCK_DIFFS.reduce((acc, d) => acc + d.changes.length, 0);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(displayCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFile = (filename: string) => {
    setCollapsedFiles((prev) => ({ ...prev, [filename]: !prev[filename] }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8 pb-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-glow">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>AI Diff Analysis</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
          Review Patch Diff
        </h1>
        <p className="text-muted text-sm md:text-base">
          Pre-flight verification for <span className="text-text font-semibold">{currentVideoTitle}</span>
        </p>
      </motion.div>

      {/* Real Patch Command Banner */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-5 border border-primary/30 bg-gradient-to-r from-primary/10 via-surface to-card space-y-2 relative shadow-xl"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-primary" />
            Active Patch Command
          </span>
          <button
            type="button"
            onClick={handleCopyCommand}
            className="text-xs text-muted hover:text-text flex items-center gap-1 transition px-2.5 py-1 rounded-lg bg-surface border border-border"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Command</span>
              </>
            )}
          </button>
        </div>

        <p className="text-base font-semibold text-text font-mono bg-black/40 p-3 rounded-xl border border-white/10">
          "{displayCommand}"
        </p>
      </motion.div>

      {/* Summary Metrics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Assets Affected", value: MOCK_DIFFS.length, detail: "4 Files Verified", icon: Layers, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { label: "Occurrences", value: totalOccurrences, detail: "7 Matches Replaced", icon: Target, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { label: "AI Confidence", value: "98.4%", detail: "High Precision Match", icon: ShieldCheck, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { label: "Est. Render Time", value: "~4s", detail: "0s Audio Re-render", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
        ].map(({ label, value, detail, icon: Icon, color }) => (
          <motion.div
            key={label}
            whileHover={{ y: -3 }}
            className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between space-y-3 h-full shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</span>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${color}`}>
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

      {/* Patch Impact Summary Panel */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6 border border-border space-y-4 shadow-xl"
      >
        <h2 className="text-base font-bold text-text flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-primary" />
          Patch Impact Analysis
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-surface/60 border border-border space-y-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Non-destructive
            </span>
            <p className="text-muted text-[11px]">Audio waveform &amp; video frames remain completely intact.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface/60 border border-border space-y-1">
            <span className="text-primary font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Instant Versioning
            </span>
            <p className="text-muted text-[11px]">Automated rollback snapshot <strong className="text-text">v1.3</strong> created.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface/60 border border-border space-y-1">
            <span className="text-purple-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Zero Cloud Render
            </span>
            <p className="text-muted text-[11px]">Saves ~1.5 hours of traditional MP4 re-exporting.</p>
          </div>
        </div>
      </motion.div>

      {/* GitHub-Style Diff Viewer */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text tracking-tight flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-primary" />
            GitHub-Style Code &amp; Text Diff
          </h2>
          <span className="text-xs font-mono text-muted">{MOCK_DIFFS.length} files changed</span>
        </div>

        <div className="space-y-4">
          {MOCK_DIFFS.map(({ asset, filename, icon: Icon, changes }) => {
            const isCollapsed = collapsedFiles[filename];

            return (
              <div key={filename} className="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
                {/* File Header */}
                <button
                  type="button"
                  onClick={() => toggleFile(filename)}
                  className="w-full flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface/80 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-text font-mono">{filename}</span>
                    <span className="text-xs text-muted font-normal">({asset})</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-emerald-400">+{changes.length} additions</span>
                    <span className="text-rose-400">-{changes.length} deletions</span>
                  </div>
                </button>

                {/* Diff Lines Container */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="font-mono text-xs overflow-x-auto divide-y divide-border/30"
                    >
                      {changes.map((c, i) => (
                        <div key={i} className="py-2 px-4 space-y-1">
                          {/* Removed Line (GitHub Red) */}
                          <div className="flex items-start gap-3 text-rose-300 bg-rose-500/10 border-l-4 border-rose-500 px-3 py-1.5 rounded-r-lg">
                            <span className="w-8 text-muted/60 select-none text-[11px] shrink-0 text-right">L{c.line}</span>
                            <span className="font-bold text-rose-400 shrink-0 select-none">-</span>
                            <span className="break-all">{c.removed}</span>
                          </div>

                          {/* Added Line (GitHub Green) */}
                          <div className="flex items-start gap-3 text-emerald-300 bg-emerald-500/10 border-l-4 border-emerald-500 px-3 py-1.5 rounded-r-lg">
                            <span className="w-8 text-muted/60 select-none text-[11px] shrink-0 text-right">L{c.line}</span>
                            <span className="font-bold text-emerald-400 shrink-0 select-none">+</span>
                            <span className="break-all">{c.added}</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Improved Warning Card */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-surface to-card p-5 md:p-6 flex items-start gap-4 shadow-xl"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-glow">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-text flex items-center gap-2">
            Safety &amp; Scope Verification Notice
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            This patch targets <strong className="text-text">text-based asset files only</strong> (Transcripts, Captions, Descriptions, and Pinned Comments).
            No audio tracks or video frames are modified. Please double-check all diffs above before applying.
          </p>
        </div>
      </motion.div>

      {/* Action Footer Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between pt-4 border-t border-border/50"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Edit
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/patch/apply")}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white font-bold text-sm shadow-glow transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4.5 h-4.5" />
          <span>Apply Patch (v1.3)</span>
          <ArrowRight className="w-4.5 h-4.5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
