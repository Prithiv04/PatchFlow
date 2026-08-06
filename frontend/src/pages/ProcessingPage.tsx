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
  Database
} from "lucide-react";

interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: ProcessingStep[] = [
  { id: "upload", label: "Upload Complete", description: "Video asset buffered & verified", icon: FileCheck },
  { id: "audio", label: "Extracting Audio", description: "Separating high-fidelity audio stream", icon: Music },
  { id: "transcript", label: "Generating Transcript", description: "AI speech-to-text alignment @ 99.2% accuracy", icon: FileText },
  { id: "captions", label: "Creating Captions", description: "Generating time-indexed WebVTT captions", icon: Subtitles },
  { id: "metadata", label: "Preparing Metadata", description: "Indexing frames for patch injection", icon: Database },
  { id: "ready", label: "Ready", description: "Video asset ready for patch creation", icon: Sparkles },
];

export default function ProcessingPage() {
  const navigate = useNavigate();
  const [completedStepIndex, setCompletedStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Step completion timer
    const stepInterval = setInterval(() => {
      setCompletedStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 700);

    // Smooth progress bar timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Automatically navigate to Video Details page after completion delay
          setTimeout(() => {
            navigate("/video/vid-1");
          }, 800);
          return 100;
        }
        return prev + 4;
      });
    }, 160);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 pb-16">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 space-y-4 border border-primary/30 bg-gradient-to-r from-card via-surface to-card relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Cpu className="w-3.5 h-3.5" />
              <span>Simulated Backend Pipeline</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
              Processing Video Asset
            </h1>
            <p className="text-muted text-sm">
              PatchFlow is analyzing timestamps, extracting transcripts, and setting up patch markers.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-glow">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text">Overall Pipeline Progress</span>
            <span className="text-primary font-mono">{progress}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-surface border border-border overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.15 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Animated Checklist Steps */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 md:p-8 space-y-4 border border-border"
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">
          Pipeline Tasks Checklist
        </h2>

        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const isDone = idx <= completedStepIndex;
            const isCurrent = idx === completedStepIndex && progress < 100;
            const StepIcon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isDone
                    ? "glass-card bg-primary/5 border-primary/30"
                    : "bg-card/40 border-border/50 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : isCurrent
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-surface text-muted border border-border"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h3
                      className={`text-sm font-semibold transition-colors ${
                        isDone ? "text-text" : "text-muted"
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p className="text-xs text-muted/80">{step.description}</p>
                  </div>
                </div>

                <div className="shrink-0 font-mono text-xs font-semibold">
                  {isDone ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      Done
                    </span>
                  ) : isCurrent ? (
                    <span className="text-primary animate-pulse">Running...</span>
                  ) : (
                    <span className="text-muted/50">Queued</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Completion Banner */}
      <AnimatePresence>
        {progress >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-5 border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-text text-sm">Processing Complete!</h4>
                <p className="text-xs text-muted">Redirecting to Video Details page...</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/video/vid-1")}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
            >
              Go to Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
