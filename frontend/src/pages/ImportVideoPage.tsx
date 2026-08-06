import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileVideo,
  X,
  CheckCircle2,
  Film,
  Sparkles,
  FolderOpen,
  MessageSquare,
  FileText,
  Tag,
  Loader2
} from "lucide-react";

const CATEGORIES = [
  "Tutorial",
  "Review",
  "Podcast",
  "News",
  "Education",
  "Product Demo",
];

export default function ImportVideoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pinnedComment, setPinnedComment] = useState("");
  const [category, setCategory] = useState("Tutorial");

  // Upload Progress Modal State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    if (!title) {
      // Auto-fill title from filename removing extension
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt.replace(/[-_]/g, " "));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Start simulated upload modal
  const handleStartUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/processing");
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Video Asset</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
          Import Video
        </h1>
        <p className="text-muted text-sm md:text-base">
          Upload a video and its associated metadata to start creating patches.
        </p>
      </div>

      {/* Main Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 md:p-8 space-y-6 border border-border"
      >
        <h2 className="text-lg font-bold text-text flex items-center gap-2">
          <Film className="w-5 h-5 text-primary" />
          Video Asset File
        </h2>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Drag & Drop Zone */}
        {!selectedFile ? (
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFilePicker}
            animate={{
              scale: isDragging ? 1.01 : 1,
              borderColor: isDragging ? "rgba(124, 58, 237, 0.8)" : "rgba(255, 255, 255, 0.15)",
              backgroundColor: isDragging ? "rgba(124, 58, 237, 0.08)" : "rgba(255, 255, 255, 0.02)",
            }}
            className="cursor-pointer border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all flex flex-col items-center justify-center space-y-5 group hover:border-primary/60 hover:bg-white/[0.03]"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-glow">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md">
              <p className="text-base font-semibold text-text">
                Drag &amp; Drop your video here, or click to browse
              </p>
              <p className="text-xs text-muted">
                Supported formats: MP4, MOV, AVI, MKV • Maximum file size: 2GB
              </p>
            </div>

            {/* Explicit Browse Files Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-white/10 text-text font-semibold text-xs border border-primary/40 hover:border-primary transition-all shadow-sm active:scale-[0.98]"
            >
              <FolderOpen className="w-4 h-4 text-primary" />
              <span>Browse Files</span>
            </button>

            <div className="flex items-center gap-2 pt-2">
              {["MP4", "MOV", "AVI", "MKV"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-surface text-muted border border-border"
                >
                  .{fmt.toLowerCase()}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          /* File Selected Preview Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-5 border border-primary/40 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shrink-0 shadow-glow">
                <FileVideo className="w-7 h-7" />
              </div>
              <div className="space-y-1 truncate">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-text truncate">
                    {selectedFile.name}
                  </p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    Ready for upload
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>Size: {formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span>Est. duration: 4:15</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Valid format
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={openFilePicker}
                className="px-3 py-1.5 rounded-xl bg-surface hover:bg-white/10 text-text border border-border text-xs font-medium transition flex items-center gap-1.5"
              >
                <FolderOpen className="w-3.5 h-3.5 text-primary" /> Change
              </button>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-3 py-1.5 rounded-xl bg-surface hover:bg-rose-500/20 hover:text-rose-400 text-muted border border-border text-xs font-medium transition flex items-center gap-1.5"
              >
                <X className="w-4 h-4" /> Remove
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Video Information Metadata Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 md:p-8 space-y-6 border border-border"
      >
        <h2 className="text-lg font-bold text-text flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Video Information &amp; Metadata
        </h2>

        <div className="space-y-5">
          {/* Video Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider block">
              Video Title <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product Demo & Feature Overview 2026"
              className="w-full h-11 px-4 rounded-xl bg-card border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider block">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context on what this video covers and target patch timestamps..."
              className="w-full p-4 rounded-xl bg-card border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all resize-none"
            />
          </div>

          {/* Pinned Comment */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              Pinned Comment / Patch Instructions
            </label>
            <textarea
              rows={2}
              value={pinnedComment}
              onChange={(e) => setPinnedComment(e.target.value)}
              placeholder="e.g. Replace pricing table overlay at 01:45 with updated v2 tier prices."
              className="w-full p-4 rounded-xl bg-card border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all resize-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-card border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-card text-text">
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                ▼
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Footer Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!selectedFile || !title.trim()}
          onClick={handleStartUpload}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-glow ${
            selectedFile && title.trim()
              ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white cursor-pointer active:scale-[0.98]"
              : "bg-surface text-muted cursor-not-allowed border border-border opacity-50"
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Video</span>
        </button>
      </div>

      {/* Animated Upload Progress Modal */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl p-6 md:p-8 max-w-md w-full border border-primary/40 space-y-6 shadow-glow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-base">Uploading Video Asset...</h3>
                  <p className="text-xs text-muted">Sending asset stream to PatchFlow processing engine</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-text">{selectedFile?.name || "video.mp4"}</span>
                  <span className="text-primary font-mono">{uploadProgress}%</span>
                </div>

                <div className="w-full h-3 rounded-full bg-surface border border-border overflow-hidden p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "easeOut", duration: 0.1 }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted font-mono pt-1">
                  <span>
                    {((selectedFile?.size || 1000000) * (uploadProgress / 100) / (1024 * 1024)).toFixed(1)}{" "}
                    / {formatFileSize(selectedFile?.size || 1000000)}
                  </span>
                  <span>Speed: 14.8 MB/s</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
