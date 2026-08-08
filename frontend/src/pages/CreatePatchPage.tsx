import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileCode2,
  Sparkles,
  Video,
  FileText,
  MessageSquare,
  Subtitles,
  CheckCircle2,
  ChevronRight,
  Wand2,
  X,
  LayoutTemplate,
  ArrowRight,
  Lightbulb,
  DollarSign,
  Link2,
  Calendar,
  Building2,
  TrendingUp,
  Tag,
  Eraser
} from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
import toast from "react-hot-toast";
import { patchService } from "@/services/patchService";

const MAX_CHARS = 500;

const TEMPLATES = [
  { label: "Replace Product Name", prompt: 'Replace every occurrence of "GPT-4" with "GPT-5".', icon: Tag, category: "Text Swap" },
  { label: "Correct Pricing", prompt: 'Replace every instance of "$19/mo" with "$29/mo".', icon: DollarSign, category: "Financial" },
  { label: "Update Sponsor", prompt: 'Replace all sponsor mentions of "AcmeCorp" with "Vercel Inc".', icon: Building2, category: "Branding" },
  { label: "Replace Affiliate Link", prompt: 'Update the affiliate link from "old.link/123" to "patchflow.io/promo".', icon: Link2, category: "URLs" },
  { label: "Update Statistics", prompt: 'Replace the statistic "10,000 users" with "50,000 active users" throughout.', icon: TrendingUp, category: "Data" },
  { label: "Correct Dates", prompt: 'Update all date references from "Q3 2025" to "Q1 2026".', icon: Calendar, category: "Timestamps" },
];

const PROMPT_SUGGESTIONS = [
  'Replace "GPT-4" with "GPT-5"',
  'Update "$19/mo" to "$29/mo"',
  'Swap "AcmeCorp" to "Vercel"',
  'Fix "Q3 2025" date typo',
];

const DETECTED_ASSETS = [
  { label: "Transcript", icon: FileText, detail: "984 Words • Auto-aligned", format: "TXT" },
  { label: "Captions", icon: Subtitles, detail: "142 Cues • Sync ready", format: "WebVTT" },
  { label: "Description", icon: FileText, detail: "Markdown Metadata", format: "MD" },
  { label: "Pinned Comment", icon: MessageSquare, detail: "Callout Comment", format: "JSON" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

import { PatchCandidates } from "@/components/PatchCandidates";
import { PatchAnalysisResponse } from "@/types/api";

export default function CreatePatchPage() {
  const navigate = useNavigate();
  const { currentVideoTitle, currentVideoId, setPatchCommand } = usePatchStore();
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);

  const charCount = prompt.length;
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const progressPercent = Math.min(100, (charCount / MAX_CHARS) * 100);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [proposal, setProposal] = useState<PatchAnalysisResponse | null>(null);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<number[]>([]);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    if (!currentVideoId) {
      toast.error("Please upload or select a video asset first.");
      navigate("/import");
      return;
    }

    try {
      setIsAnalyzing(true);
      setPatchCommand(prompt.trim());
      const patchProposal = await patchService.analyzePatch(currentVideoId, prompt.trim());
      setProposal(patchProposal);
      usePatchStore.getState().setActivePatch(patchProposal);

      const candidateIds = patchProposal.candidate_segments
        ? patchProposal.candidate_segments.map((c) => c.segment_id)
        : patchProposal.diffs.map((d) => d.segment_id);
      setSelectedSegmentIds(candidateIds);

      if (patchProposal.occurrences_count > 0) {
        toast.success(`AI parsed intent & found ${patchProposal.occurrences_count} candidate(s)!`);
      } else {
        toast.error("No confident matches found in transcript for this command.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze patch command");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleSegment = (segmentId: number) => {
    setSelectedSegmentIds((prev) =>
      prev.includes(segmentId) ? prev.filter((id) => id !== segmentId) : [...prev, segmentId]
    );
  };

  const handleProceedToPreview = () => {
    if (!proposal) return;

    // Filter diffs based on selected candidate segments
    if (selectedSegmentIds.length > 0 && proposal.diffs) {
      const filteredDiffs = proposal.diffs.filter((d) => selectedSegmentIds.includes(d.segment_id));
      const updatedProposal = {
        ...proposal,
        diffs: filteredDiffs,
        occurrences_count: filteredDiffs.length,
      };
      usePatchStore.getState().setActivePatch(updatedProposal);
    }

    navigate("/patch/preview");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-8 pb-16"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-glow">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Create Patch Workflow</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
          Define Your Patch Command
        </h1>
        <p className="text-muted text-sm md:text-base">
          Describe the text, transcript, or caption changes to execute across all video assets.
        </p>
      </motion.div>

      {/* Current Video Context */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-4 border border-border flex items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center gap-4 truncate">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-glow">
            <Video className="w-5 h-5" />
          </div>
          <div className="truncate">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">
              Patching Target Video
            </p>
            <p className="text-sm font-bold text-text truncate">{currentVideoTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-surface text-muted border border-border">
            ID: {currentVideoId}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
            4 Assets Ready
          </span>
        </div>
      </motion.div>

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Prompt Editor & Detected Assets */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Main Textarea Editor Card */}
          <div className="glass-card rounded-2xl border border-border p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-text text-base">Natural Language Patch Prompt</h2>
              </div>
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt("")}
                  className="text-xs text-muted hover:text-rose-400 flex items-center gap-1 transition px-2 py-1 rounded-md hover:bg-white/5"
                >
                  <Eraser className="w-3.5 h-3.5" /> Clear prompt
                </button>
              )}
            </div>

            {/* Enhanced Animated Textarea Container */}
            <motion.div
              animate={{
                boxShadow: focused
                  ? "0 0 0 2px rgba(124, 58, 237, 0.4), 0 8px 32px rgba(124, 58, 237, 0.15)"
                  : "0 0 0 1px rgba(255, 255, 255, 0.08)",
              }}
              className="rounded-2xl overflow-hidden bg-card/80 border border-border transition-all relative"
            >
              <textarea
                rows={6}
                value={prompt}
                maxLength={MAX_CHARS}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={'e.g. Replace every occurrence of "GPT-4" with "GPT-5" across transcripts and captions.'}
                className="w-full px-5 py-4 bg-transparent text-text text-sm placeholder:text-muted/50 focus:outline-none resize-none leading-normal"
              />

              {/* Progress Indicator Bar along bottom of textarea */}
              <div className="w-full h-1 bg-surface">
                <motion.div
                  className={`h-full transition-all duration-200 ${
                    charCount > MAX_CHARS * 0.9 ? "bg-amber-400" : "bg-gradient-to-r from-primary to-purple-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </motion.div>

            {/* Live Character & Word Counter Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-muted pt-1">
              <div className="flex items-center gap-3">
                <span className="text-text font-semibold">{charCount} / {MAX_CHARS} chars</span>
                <span>•</span>
                <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
              </div>
              <span className="text-[11px] text-muted/70">Press 'Analyze Patch' when ready</span>
            </div>

            {/* Quick One-Touch Prompt Suggestions */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Prompt Suggestions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((sug) => (
                  <motion.button
                    key={sug}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setPrompt(sug);
                      setProposal(null);
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-surface hover:bg-primary/15 hover:text-primary text-muted border border-border hover:border-primary/30 transition-all font-medium"
                  >
                    + {sug}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Patch Intent & Candidate Matches Proposal Section */}
          {proposal && (
            <PatchCandidates
              operation={proposal.parsed_operation || "replace"}
              target={proposal.parsed_target || proposal.diffs[0]?.target || ""}
              replacement={proposal.parsed_replacement || proposal.diffs[0]?.replacement || ""}
              confidenceScore={proposal.confidence_score}
              candidates={proposal.candidate_segments || []}
              affectedAssets={proposal.affected_assets}
              selectedSegmentIds={selectedSegmentIds}
              onToggleSegment={handleToggleSegment}
            />
          )}

          {/* Improved Detected Assets Cards */}
          <div className="glass-card rounded-2xl border border-border p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text flex items-center gap-2 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Detected Asset Pipeline
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                All 4 Indexed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DETECTED_ASSETS.map(({ label, icon: Icon, detail, format }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border hover:border-emerald-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{label}</p>
                      <p className="text-[11px] text-muted">{detail}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-surface text-muted border border-border shrink-0">
                    .{format.toLowerCase()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column (1 Col): Command Templates Cards */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="glass-card rounded-2xl border border-border p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4.5 h-4.5 text-primary" />
                <h2 className="font-bold text-text text-base">Command Templates</h2>
              </div>
              <span className="text-xs font-mono text-muted">{TEMPLATES.length} presets</span>
            </div>
            <p className="text-xs text-muted">Click any template card below to insert into the editor.</p>

            <div className="space-y-2.5">
              {TEMPLATES.map((t) => {
                const IconComp = t.icon;
                return (
                  <motion.button
                    key={t.label}
                    whileHover={{ x: 3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setPrompt(t.prompt);
                      setProposal(null);
                    }}
                    className="w-full text-left p-3 rounded-xl glass-card hover:bg-primary/10 hover:border-primary/40 border border-border transition-all flex items-start justify-between group space-y-1"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <IconComp className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                          {t.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted line-clamp-1 group-hover:text-muted/90 font-mono">
                        {t.prompt}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Footer Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-end gap-4 pt-4 border-t border-border/50"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition"
        >
          Cancel
        </button>

        <motion.button
          type="button"
          whileHover={{ scale: prompt.trim() ? 1.02 : 1 }}
          whileTap={{ scale: prompt.trim() ? 0.98 : 1 }}
          disabled={!prompt.trim() || isAnalyzing}
          onClick={handleAnalyze}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-glow ${
            prompt.trim()
              ? "bg-surface hover:bg-primary/20 text-primary border border-primary/30 cursor-pointer"
              : "bg-surface text-muted border border-border opacity-50 cursor-not-allowed"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? "Analyzing..." : "Analyze Patch Intent"}</span>
        </motion.button>

        {proposal && proposal.occurrences_count > 0 && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProceedToPreview}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-glow bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white cursor-pointer active:scale-[0.98]"
          >
            <span>Proceed to Preview ({selectedSegmentIds.length} candidate(s))</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
