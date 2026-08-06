import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  Cpu,
  Sparkles,
  ArrowRight,
  FileCheck,
  Music,
  FileText,
  Subtitles,
  Database,
  Film,
  Zap,
  Check,
  Clock
} from "lucide-react";

interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  detail: string;
  icon: React.ElementType;
}

const STEPS: ProcessingStep[] = [
  { id: "upload", label: "Upload Complete", description: "Video asset buffered & verified", detail: "245.8 MB • SHA-256 Verified", icon: FileCheck },
  { id: "audio", label: "Extracting Audio", description: "Separating high-fidelity audio stream", detail: "AAC 320kbps • 48kHz Stereo", icon: Music },
  { id: "transcript", label: "Generating Transcript", description: "AI speech-to-text alignment", detail: "984 words • 99.2% accuracy", icon: FileText },
  { id: "captions", label: "Creating Captions", description: "Generating time-indexed WebVTT captions", detail: "142 cues • Auto-synced", icon: Subtitles },
  { id: "metadata", label: "Preparing Metadata", description: "Indexing frames for patch injection", detail: "240 keyframes indexed", icon: Database },
  { id: "ready", label: "Ready", description: "Video asset ready for patch creation", detail: "v1.0 Baseline created", icon: Sparkles },
];

export default function ProcessingPage() {
  const navigate = useNavigate();
  const [completedStepIndex, setCompletedStepIndex] = useState(-1);
  const [progress, setProgress] = useState(5);
  const [isFinished, setIsFinished] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Step completion timer
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      setCompletedStepIndex(stepIdx);
      stepIdx += 1;
      if (stepIdx >= STEPS.length) {
        clearInterval(stepInterval);
      }
    }, 750);

    // Smooth progress bar timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsFinished(true);
          return 100;
        }
        return prev + 3;
      });
    }, 120);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Automatic redirect countdown when finished
  useEffect(() => {
    if (!isFinished) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/video/vid-1");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, navigate]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 pb-16">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 space-y-5 border border-primary/30 bg-gradient-to-r from-card via-surface to-card relative overflow-hidden shadow-2xl"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs font-semibold text-primary shadow-glow">
              <Cpu className="w-3.5 h-3.5" />
              <span>Simulated Backend Pipeline</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
              {isFinished ? "Processing Complete!" : "Processing Video Asset..."}
            </h1>
            <p className="text-muted text-sm">
              {isFinished
                ? "All asset streams, transcripts, and keyframe markers are fully prepared."
                : "PatchFlow is analyzing timestamps, extracting transcripts, and indexing frames."}
            </p>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-300 ${
              isFinished
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow"
                : "bg-primary/15 text-primary border-primary/30 shadow-glow"
            }`}
          >
            {isFinished ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin" />
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text flex items-center gap-2">
              <span>Overall Pipeline Progress</span>
              <span className="text-[11px] font-normal text-muted">
                ({Math.min(completedStepIndex + 1, STEPS.length)}/{STEPS.length} tasks)
              </span>
            </span>
            <span className="text-primary font-mono text-sm">{progress}%</span>
          </div>

          {/* Enhanced Glowing Bar */}
          <div className="w-full h-3.5 rounded-full bg-surface border border-border overflow-hidden p-0.5 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.15 }}
            >
              {/* Animated shimmer highlight line */}
              {!isFinished && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              )}
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-0.5">
            <span>Status: {isFinished ? "Completed" : "Active Pipeline"}</span>
            <span>
              {isFinished
                ? "Time taken: 3.2s"
                : `Est. ${Math.max(0, Math.ceil((100 - progress) / 30))}s remaining`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Sequential Task Cards Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 md:p-8 space-y-4 border border-border"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            Task Execution Breakdown
          </h2>
          <span className="text-xs font-mono text-muted">Sequential Queue</span>
        </div>

        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const isDone = idx <= completedStepIndex;
            const isCurrent = idx === completedStepIndex + 1 && progress < 100;
            const StepIcon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                  isDone
                    ? "glass-card bg-emerald-500/[0.04] border-emerald-500/30"
                    : isCurrent
                    ? "glass-card bg-primary/10 border-primary/50 shadow-glow"
                    : "bg-card/40 border-border/50 opacity-40"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Spinner -> Checkmark Animated Node Container */}
                  <div className="relative shrink-0">
                    <AnimatePresence mode="wait">
                      {isDone ? (
                        <motion.div
                          key="done"
                          initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-glow"
                        >
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </motion.div>
                      ) : isCurrent ? (
                        <motion.div
                          key="running"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-9 h-9 rounded-xl bg-primary/20 text-primary border border-primary/50 flex items-center justify-center shadow-glow"
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="queued"
                          className="w-9 h-9 rounded-xl bg-surface text-muted border border-border flex items-center justify-center"
                        >
                          <StepIcon className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Task Labels & Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-semibold transition-colors ${
                          isDone ? "text-text" : isCurrent ? "text-primary" : "text-muted"
                        }`}
                      >
                        {step.label}
                      </h3>
                      {isDone && (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {step.detail}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted/80">{step.description}</p>
                  </div>
                </div>

                {/* Status Indicator Tag */}
                <div className="shrink-0 font-mono text-xs font-semibold">
                  {isDone ? (
                    <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      ✓ Done
                    </span>
                  ) : isCurrent ? (
                    <span className="text-primary animate-pulse bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                      Running...
                    </span>
                  ) : (
                    <span className="text-muted/50 px-2 py-0.5">Queued</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Celebratory Success Screen Before Redirect */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass-card rounded-2xl p-6 border border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 via-surface to-emerald-500/10 space-y-5 shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-glow">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-text text-base md:text-lg">
                    Asset Fully Prepared &amp; Ready!
                  </h3>
                  <p className="text-xs text-muted">
                    Transcripts, captions, and keyframes indexed. Auto-redirecting in{" "}
                    <span className="text-emerald-400 font-bold font-mono text-sm">{countdown}s</span>...
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/video/vid-1")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold text-xs transition-all shadow-glow flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]"
              >
                <span>Go to Video Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Asset Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-500/20 text-xs">
              <div className="p-2.5 rounded-xl bg-surface/60 border border-border">
                <span className="text-muted block text-[11px]">Transcripts</span>
                <span className="font-bold text-text">984 Words</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface/60 border border-border">
                <span className="text-muted block text-[11px]">Captions (.srt)</span>
                <span className="font-bold text-text">142 Cues</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface/60 border border-border">
                <span className="text-muted block text-[11px]">Keyframes</span>
                <span className="font-bold text-text">240 Indexed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface/60 border border-border">
                <span className="text-muted block text-[11px]">Pipeline Status</span>
                <span className="font-bold text-emerald-400">100% Ready</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
