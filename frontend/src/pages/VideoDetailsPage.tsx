import React from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileCode2,
  Play,
  Plus,
  Sparkles,
  Share2,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { mockVideos } from "@/mocks/videos";
import { usePatchStore } from "@/store/usePatchStore";

export default function VideoDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const video = mockVideos.find((v) => v.id === id) || mockVideos[0];
  const { setCurrentVideo } = usePatchStore();

  const handleCreatePatch = () => {
    setCurrentVideo(video.id, video.title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-text transition px-3 py-1.5 rounded-xl glass-card border border-border"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl glass-card border border-border text-muted hover:text-text transition">
            <Share2 className="w-4 h-4" />
          </button>
          <Link
            to="/create-patch"
            onClick={handleCreatePatch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white font-semibold text-xs shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" /> Create New Patch
          </Link>
        </div>
      </div>

      {/* Video + Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mock Video Player */}
          <div className="glass-card rounded-2xl overflow-hidden border border-border relative aspect-video bg-black/60 group flex items-center justify-center">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <button className="relative z-10 w-16 h-16 rounded-full bg-primary/90 hover:bg-primary text-white flex items-center justify-center shadow-glow group-hover:scale-110 transition duration-300">
              <Play className="w-7 h-7 fill-white ml-1" />
            </button>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
              <span className="font-mono bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                00:00 / {video.duration}
              </span>
              <span className="bg-primary/30 border border-primary/40 px-2.5 py-1 rounded-md font-semibold text-primary">
                {video.version}
              </span>
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-text">{video.title}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for patching
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Uploaded video asset ready for timeline segment replacement, caption overlays, and audio patching.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/50 text-xs">
              <div>
                <span className="text-muted block">Duration</span>
                <span className="font-semibold text-text">{video.duration}</span>
              </div>
              <div>
                <span className="text-muted block">Patches Applied</span>
                <span className="font-semibold text-text">{video.patchesCount} patches</span>
              </div>
              <div>
                <span className="text-muted block">Last Patched</span>
                <span className="font-semibold text-text">{video.lastPatched}</span>
              </div>
              <div>
                <span className="text-muted block">Asset Version</span>
                <span className="font-semibold text-primary">{video.version}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Patches & Actions */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-primary" /> Active Patches
              </h2>
              <span className="text-xs text-muted font-mono">{video.patchesCount} active</span>
            </div>
            <div className="space-y-3">
              {[
                { title: "Pricing Tier Update @ 01:15", time: "10 mins ago", status: "Applied" },
                { title: "Audio Sync Fix @ 02:40", time: "2 hours ago", status: "Applied" },
                { title: "Intro Logo Swap", time: "Yesterday", status: "Applied" },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs hover:border-primary/40 transition"
                >
                  <div className="truncate">
                    <p className="font-semibold text-text truncate">{p.title}</p>
                    <p className="text-[11px] text-muted">{p.time}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/create-patch"
              onClick={handleCreatePatch}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-glow"
            >
              <Sparkles className="w-3.5 h-3.5" /> Create a New Patch
            </Link>

            <Link
              to="/history"
              className="w-full py-2 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text text-xs font-medium border border-border transition flex items-center justify-center gap-1.5"
            >
              <span>View Version History</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
