import React from "react";
import { SegmentCandidate } from "@/types/api";
import { AlertTriangle, CheckCircle2, FileText, Subtitles, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PatchCandidatesProps {
  operation?: string;
  target?: string;
  replacement?: string;
  confidenceScore: number;
  candidates: SegmentCandidate[];
  affectedAssets: string[];
  selectedSegmentIds: number[];
  onToggleSegment: (segmentId: number) => void;
}

export const PatchCandidates: React.FC<PatchCandidatesProps> = ({
  operation = "replace",
  target = "",
  replacement = "",
  confidenceScore,
  candidates,
  affectedAssets,
  selectedSegmentIds,
  onToggleSegment,
}) => {
  const confidencePercent = Math.round(confidenceScore * 100);
  const isAmbiguous = candidates.length > 1 || (confidencePercent >= 70 && confidencePercent < 90);

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 70) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 border border-border space-y-4 shadow-xl"
    >
      {/* Header — AI Understanding */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              AI Patch Understanding
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                {operation}
              </span>
            </h3>
            <p className="text-xs text-muted">Intent extracted from natural language command</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${getConfidenceColor(confidencePercent)}`}>
          <span>Confidence: {confidencePercent}%</span>
        </div>
      </div>

      {/* Target & Replacement Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-card/60 border border-border/50">
          <span className="text-[11px] font-semibold uppercase text-muted tracking-wider block mb-1">Target Phrase</span>
          <span className="text-sm font-mono text-rose-300 font-medium break-all">
            {target || "(Auto-extracted)"}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-card/60 border border-border/50">
          <span className="text-[11px] font-semibold uppercase text-muted tracking-wider block mb-1">Replacement</span>
          <span className="text-sm font-mono text-emerald-300 font-medium break-all flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 shrink-0 text-muted" />
            {replacement || "(Not specified)"}
          </span>
        </div>
      </div>

      {/* Affected Assets & Match Count */}
      <div className="flex flex-wrap items-center justify-between text-xs text-muted pt-1">
        <div className="flex items-center gap-3">
          <span className="font-medium text-text">Affected Assets:</span>
          {affectedAssets.map((asset) => (
            <span key={asset} className="flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              {asset === "transcript" ? "Transcript" : asset === "captions" ? "Captions (.srt)" : asset}
            </span>
          ))}
        </div>
        <div>
          Candidates Found: <span className="font-semibold text-text">{candidates.length} segment(s)</span>
        </div>
      </div>

      {/* Ambiguous Match Warning & Candidates List */}
      {isAmbiguous && (
        <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Multiple or ambiguous matches found</p>
            <p className="text-amber-300/80 text-[11px] mt-0.5">
              Review and select candidate segments below to confirm which occurrences to modify.
            </p>
          </div>
        </div>
      )}

      {/* Candidate Segments List */}
      {candidates.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-text uppercase tracking-wider block">
            Candidate Transcript Segments
          </span>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {candidates.map((cand) => {
              const isChecked = selectedSegmentIds.includes(cand.segment_id);
              const candScorePct = Math.round(cand.score * 100);
              return (
                <div
                  key={cand.segment_id}
                  onClick={() => onToggleSegment(cand.segment_id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isChecked
                      ? "bg-primary/15 border-primary/40 text-text shadow-glow-sm"
                      : "bg-card/40 border-border/40 text-muted hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-border text-primary focus:ring-primary/40"
                      />
                      <span className="font-mono font-semibold text-text">
                        Segment #{cand.segment_id} ({cand.start.toFixed(1)}s - {cand.end.toFixed(1)}s)
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getConfidenceColor(candScorePct)}`}>
                      {candScorePct}% {cand.is_exact ? "Exact" : "Semantic"}
                    </span>
                  </div>
                  <div className="text-xs text-text/80 pl-6 space-y-1">
                    <p className="line-through text-rose-300/80 font-mono">{cand.original}</p>
                    <p className="text-emerald-300 font-mono">{cand.patched}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};
