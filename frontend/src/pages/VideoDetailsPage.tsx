import React, { useEffect } from "react";
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
  Download,
  FileText,
  Music,
  Film,
} from "lucide-react";
import { usePatchStore } from "@/store/usePatchStore";
import { getStaticAssetUrl } from "@/services/api";
import { exportService } from "@/services/exportService";

export default function VideoDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    currentVideoId,
    currentVideoTitle,
    metadata,
    transcript,
    fetchMetadata,
    fetchTranscript,
    setCurrentVideoId,
  } = usePatchStore();

  const targetId = id || currentVideoId;

  useEffect(() => {
    if (targetId) {
      setCurrentVideoId(targetId);
      fetchMetadata(targetId);
      fetchTranscript(targetId);
    }
  }, [targetId, setCurrentVideoId, fetchMetadata, fetchTranscript]);

  const handleCreatePatch = () => {
    if (targetId) {
      setCurrentVideoId(targetId);
    }
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
          {targetId && (
            <button
              onClick={() => exportService.downloadAsset(targetId, "package")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-primary/30 text-primary hover:bg-primary/10 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4" /> Export Package ZIP
            </button>
          )}
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
          {/* Media Preview Player & Audio Stream */}
          <div className="glass-card rounded-2xl overflow-hidden border border-border relative aspect-video bg-black/80 group flex flex-col justify-between p-4">
            {metadata?.thumbnail ? (
              <img
                src={getStaticAssetUrl(metadata.thumbnail)}
                alt={currentVideoTitle}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                <Film className="w-16 h-16 opacity-40 animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

            <div className="relative z-10 flex items-center justify-between text-xs text-white/90">
              <span className="font-mono bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                {metadata?.resolution || "1920x1080"} • {metadata?.fps || 30} FPS
              </span>
              <span className="bg-primary/80 border border-primary px-2.5 py-1 rounded-md font-bold text-white shadow-glow">
                FastAPI Live Asset
              </span>
            </div>

            {/* Audio Stream Control */}
            <div className="relative z-10 space-y-2 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-xs text-purple-300 font-semibold">
                <Music className="w-4 h-4 text-primary" />
                <span>Extracted PCM Audio Stream</span>
              </div>
              {metadata?.audio_file ? (
                <audio
                  src={getStaticAssetUrl(metadata.audio_file)}
                  controls
                  className="w-full h-9 rounded-lg"
                />
              ) : (
                <p className="text-xs text-muted">Audio stream initializing...</p>
              )}
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-text">
                {currentVideoTitle}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for patching
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Video asset fully processed and synchronized. Timecodes and transcript segments indexed for precision patch injection.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/50 text-xs">
              <div>
                <span className="text-muted block">Duration</span>
                <span className="font-semibold text-text">
                  {metadata ? `${Math.round(metadata.duration)}s` : "Loading..."}
                </span>
              </div>
              <div>
                <span className="text-muted block">Resolution</span>
                <span className="font-semibold text-text">
                  {metadata?.resolution || "1920x1080"}
                </span>
              </div>
              <div>
                <span className="text-muted block">Video Codec</span>
                <span className="font-semibold text-text font-mono">
                  {metadata?.video_codec || "h264"}
                </span>
              </div>
              <div>
                <span className="text-muted block">Container</span>
                <span className="font-semibold text-primary uppercase font-mono">
                  {metadata?.container || "mp4"}
                </span>
              </div>
            </div>
          </div>

          {/* Live Transcript View */}
          <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Whisper Transcript Segments
              </h2>
              {targetId && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportService.downloadAsset(targetId, "transcript")}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> JSON
                  </button>
                  <button
                    onClick={() => exportService.downloadAsset(targetId, "captions")}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> SRT
                  </button>
                </div>
              )}
            </div>

            {transcript?.segments && transcript.segments.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {transcript.segments.map((seg) => (
                  <div
                    key={seg.id}
                    className="p-3 rounded-xl bg-surface border border-border flex items-start gap-3 hover:border-primary/40 transition"
                  >
                    <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 shrink-0">
                      {seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s
                    </span>
                    <p className="text-xs text-text leading-relaxed">{seg.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic">
                {transcript?.full_text || "No transcript segments available. Click Transcribe to generate."}
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Patches & Export Downloads */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-primary" /> Asset Export Options
              </h2>
            </div>
            {targetId && (
              <div className="space-y-2.5">
                <button
                  onClick={() => exportService.downloadAsset(targetId, "video")}
                  className="w-full p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs hover:border-primary/40 transition group"
                >
                  <span className="font-semibold text-text group-hover:text-primary">Download Original Video</span>
                  <Download className="w-4 h-4 text-muted group-hover:text-primary" />
                </button>

                <button
                  onClick={() => exportService.downloadAsset(targetId, "transcript")}
                  className="w-full p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs hover:border-primary/40 transition group"
                >
                  <span className="font-semibold text-text group-hover:text-primary">Download Transcript (JSON)</span>
                  <Download className="w-4 h-4 text-muted group-hover:text-primary" />
                </button>

                <button
                  onClick={() => exportService.downloadAsset(targetId, "captions")}
                  className="w-full p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs hover:border-primary/40 transition group"
                >
                  <span className="font-semibold text-text group-hover:text-primary">Download Captions (SRT)</span>
                  <Download className="w-4 h-4 text-muted group-hover:text-primary" />
                </button>

                <button
                  onClick={() => exportService.downloadAsset(targetId, "audio")}
                  className="w-full p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs hover:border-primary/40 transition group"
                >
                  <span className="font-semibold text-text group-hover:text-primary">Download WAV Audio</span>
                  <Download className="w-4 h-4 text-muted group-hover:text-primary" />
                </button>

                <button
                  onClick={() => exportService.downloadAsset(targetId, "thumbnail")}
                  className="w-full p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs hover:border-primary/40 transition group"
                >
                  <span className="font-semibold text-text group-hover:text-primary">Download Thumbnail (JPG)</span>
                  <Download className="w-4 h-4 text-muted group-hover:text-primary" />
                </button>

                <button
                  onClick={() => exportService.downloadAsset(targetId, "package")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow-glow"
                >
                  <Download className="w-4 h-4" /> Download Complete ZIP Package
                </button>
              </div>
            )}

            <Link
              to="/create-patch"
              onClick={handleCreatePatch}
              className="w-full py-2.5 rounded-xl bg-surface hover:bg-white/10 border border-primary/40 text-primary text-xs font-semibold transition flex items-center justify-center gap-2"
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
