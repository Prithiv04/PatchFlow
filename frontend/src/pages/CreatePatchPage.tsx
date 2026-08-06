import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";

const TEMPLATES = [
  { label: "Replace Product Name", prompt: "Replace every occurrence of [OldName] with [NewName]." },
  { label: "Update Sponsor", prompt: "Replace all sponsor mentions of [OldSponsor] with [NewSponsor]." },
  { label: "Replace Affiliate Link", prompt: "Update the affiliate link from [old-link] to [new-link]." },
  { label: "Correct Pricing", prompt: "Replace every instance of $[OldPrice]/mo with $[NewPrice]/mo." },
  { label: "Update Statistics", prompt: "Replace the statistic '[OldStat]' with '[NewStat]' throughout." },
  { label: "Update Company Name", prompt: "Replace all mentions of [OldCompany] with [NewCompany]." },
  { label: "Correct Dates", prompt: "Update all date references from [OldDate] to [NewDate]." },
];

const DETECTED_ASSETS = [
  { label: "Transcript", icon: FileText },
  { label: "Captions (.srt)", icon: Subtitles },
  { label: "Description", icon: FileText },
  { label: "Pinned Comment", icon: MessageSquare },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function CreatePatchPage() {
  const navigate = useNavigate();
  const { currentVideoTitle, currentVideoId, setPatchCommand } = usePatchStore();
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);

  const handleAnalyze = () => {
    if (!prompt.trim()) return;
    setPatchCommand(prompt.trim());
    navigate("/patch/preview");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8 pb-16"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Create Patch</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
          Define Your Patch
        </h1>
        <p className="text-muted text-sm md:text-base">
          Describe the change you want to apply across all video assets.
        </p>
      </motion.div>

      {/* Current Video Context */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-4 border border-border flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
          <Video className="w-5 h-5" />
        </div>
        <div className="truncate">
          <p className="text-xs text-muted font-semibold uppercase tracking-wider">
            Patching Video
          </p>
          <p className="text-sm font-bold text-text truncate">{currentVideoTitle}</p>
        </div>
        <span className="ml-auto px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-surface text-muted border border-border shrink-0">
          ID: {currentVideoId}
        </span>
      </motion.div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Prompt Editor */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-text">Patch Command</h2>
            </div>

            <motion.div
              animate={{
                boxShadow: focused
                  ? "0 0 0 2px rgba(124, 58, 237, 0.4)"
                  : "0 0 0 1px rgba(255, 255, 255, 0.08)",
              }}
              className="rounded-xl overflow-hidden"
            >
              <textarea
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={'Replace every occurrence of "GPT-4" with "GPT-5".'}
                className="w-full p-4 bg-card text-text text-sm placeholder:text-muted/50 focus:outline-none resize-none border-0"
              />
            </motion.div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted font-mono">
                {prompt.length} characters
              </span>
              {prompt && (
                <button
                  onClick={() => setPrompt("")}
                  className="text-xs text-muted hover:text-danger flex items-center gap-1 transition"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Detected Assets */}
          <div className="glass-card rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-bold text-text flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Detected Assets
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {DETECTED_ASSETS.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm font-medium text-text">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Templates */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="glass-card rounded-2xl border border-border p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <LayoutTemplate className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-text text-sm">Command Templates</h2>
            </div>
            <p className="text-xs text-muted">Click a template to fill the editor.</p>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <motion.button
                  key={t.label}
                  whileHover={{ x: 3 }}
                  onClick={() => setPrompt(t.prompt)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-text hover:bg-white/5 border border-transparent hover:border-border transition-all flex items-center justify-between group"
                >
                  <span>{t.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary transition" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-end gap-4 pt-4 border-t border-border/50"
      >
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition"
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!prompt.trim()}
          onClick={handleAnalyze}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-glow ${
            prompt.trim()
              ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white"
              : "bg-surface text-muted border border-border opacity-50 cursor-not-allowed"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Analyze Patch
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
