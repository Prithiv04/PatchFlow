import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, FileVideo, X, CheckCircle2, Film, Sparkles, MessageSquare, FileText, Tag, Loader2 } from "lucide-react";
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
    const fileInputRef = useRef(null);
    // State
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pinnedComment, setPinnedComment] = useState("");
    const [category, setCategory] = useState("Tutorial");
    // Upload Progress Modal State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    // Drag & Drop Handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileSelection(file);
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    };
    const handleFileSelection = (file) => {
        setSelectedFile(file);
        if (!title) {
            // Auto-fill title from filename removing extension
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            setTitle(nameWithoutExt.replace(/[-_]/g, " "));
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };
    // Start simulated upload modal
    const handleStartUpload = () => {
        if (!selectedFile)
            return;
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
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-8 pb-16", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "New Video Asset" })] }), _jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-text tracking-tight", children: "Import Video" }), _jsx("p", { className: "text-muted text-sm md:text-base", children: "Upload a video and its associated metadata to start creating patches." })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, className: "glass-card rounded-2xl p-6 md:p-8 space-y-6 border border-border", children: [_jsxs("h2", { className: "text-lg font-bold text-text flex items-center gap-2", children: [_jsx(Film, { className: "w-5 h-5 text-primary" }), "Video Asset File"] }), _jsx("input", { ref: fileInputRef, type: "file", accept: "video/mp4,video/quicktime,video/x-msvideo,video/x-matroska", onChange: handleFileChange, className: "hidden" }), !selectedFile ? (_jsxs(motion.div, { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, onClick: () => fileInputRef.current?.click(), animate: {
                            scale: isDragging ? 1.01 : 1,
                            borderColor: isDragging ? "rgba(124, 58, 237, 0.8)" : "rgba(255, 255, 255, 0.15)",
                            backgroundColor: isDragging ? "rgba(124, 58, 237, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        }, className: "cursor-pointer border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all flex flex-col items-center justify-center space-y-4 group hover:border-primary/60 hover:bg-white/[0.03]", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-glow", children: _jsx(Upload, { className: "w-8 h-8" }) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "text-base font-semibold text-text", children: ["Drag & Drop your video here, or", " ", _jsx("span", { className: "text-primary underline underline-offset-4 font-bold", children: "Browse Files" })] }), _jsx("p", { className: "text-xs text-muted", children: "Supported formats: MP4, MOV, AVI, MKV \u2022 Maximum file size: 2GB" })] }), _jsx("div", { className: "flex items-center gap-2 pt-2", children: ["MP4", "MOV", "AVI", "MKV"].map((fmt) => (_jsxs("span", { className: "px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-surface text-muted border border-border", children: [".", fmt.toLowerCase()] }, fmt))) })] })) : (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, className: "glass-card rounded-2xl p-5 border border-primary/40 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shrink-0 shadow-glow", children: _jsx(FileVideo, { className: "w-7 h-7" }) }), _jsxs("div", { className: "space-y-1 truncate", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-bold text-text truncate", children: selectedFile.name }), _jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0", children: "Ready for upload" })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-muted", children: [_jsxs("span", { children: ["Size: ", formatFileSize(selectedFile.size)] }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "Est. duration: 4:15" }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: "text-emerald-400 flex items-center gap-1 font-medium", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " Valid format"] })] })] })] }), _jsxs("button", { onClick: () => setSelectedFile(null), className: "px-3 py-1.5 rounded-xl bg-surface hover:bg-rose-500/20 hover:text-rose-400 text-muted border border-border text-xs font-medium transition flex items-center gap-1.5 shrink-0", children: [_jsx(X, { className: "w-4 h-4" }), " Remove"] })] }))] }), _jsxs(motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "glass-card rounded-2xl p-6 md:p-8 space-y-6 border border-border", children: [_jsxs("h2", { className: "text-lg font-bold text-text flex items-center gap-2", children: [_jsx(FileText, { className: "w-5 h-5 text-primary" }), "Video Information & Metadata"] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-xs font-semibold text-muted uppercase tracking-wider block", children: ["Video Title ", _jsx("span", { className: "text-primary", children: "*" })] }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Product Demo & Feature Overview 2026", className: "w-full h-11 px-4 rounded-xl bg-card border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-muted uppercase tracking-wider block", children: "Description" }), _jsx("textarea", { rows: 3, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Provide context on what this video covers and target patch timestamps...", className: "w-full p-4 rounded-xl bg-card border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(MessageSquare, { className: "w-3.5 h-3.5 text-primary" }), "Pinned Comment / Patch Instructions"] }), _jsx("textarea", { rows: 2, value: pinnedComment, onChange: (e) => setPinnedComment(e.target.value), placeholder: "e.g. Replace pricing table overlay at 01:45 with updated v2 tier prices.", className: "w-full p-4 rounded-xl bg-card border border-border text-text text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all resize-none" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Tag, { className: "w-3.5 h-3.5 text-primary" }), "Category"] }), _jsxs("div", { className: "relative", children: [_jsx("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "w-full h-11 px-4 rounded-xl bg-card border border-border text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all appearance-none cursor-pointer", children: CATEGORIES.map((cat) => (_jsx("option", { value: cat, className: "bg-card text-text", children: cat }, cat))) }), _jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted", children: "\u25BC" })] })] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-4 pt-4 border-t border-border/50", children: [_jsx("button", { type: "button", onClick: () => navigate("/"), className: "px-5 py-2.5 rounded-xl glass-card hover:bg-white/10 text-muted hover:text-text font-medium text-sm border border-border transition", children: "Cancel" }), _jsxs("button", { type: "button", disabled: !selectedFile || !title.trim(), onClick: handleStartUpload, className: `inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-glow ${selectedFile && title.trim()
                            ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 text-white cursor-pointer active:scale-[0.98]"
                            : "bg-surface text-muted cursor-not-allowed border border-border opacity-50"}`, children: [_jsx(Upload, { className: "w-4 h-4" }), _jsx("span", { children: "Upload Video" })] })] }), _jsx(AnimatePresence, { children: isUploading && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md", children: _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, className: "glass-card rounded-2xl p-6 md:p-8 max-w-md w-full border border-primary/40 space-y-6 shadow-glow", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary", children: _jsx(Loader2, { className: "w-5 h-5 animate-spin" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-text text-base", children: "Uploading Video Asset..." }), _jsx("p", { className: "text-xs text-muted", children: "Sending asset stream to PatchFlow processing engine" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-semibold", children: [_jsx("span", { className: "text-text", children: selectedFile?.name || "video.mp4" }), _jsxs("span", { className: "text-primary font-mono", children: [uploadProgress, "%"] })] }), _jsx("div", { className: "w-full h-3 rounded-full bg-surface border border-border overflow-hidden p-0.5", children: _jsx(motion.div, { className: "h-full bg-gradient-to-r from-primary to-purple-500 rounded-full", style: { width: `${uploadProgress}%` }, transition: { ease: "easeOut", duration: 0.1 } }) }), _jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted font-mono pt-1", children: [_jsxs("span", { children: [((selectedFile?.size || 1000000) * (uploadProgress / 100) / (1024 * 1024)).toFixed(1), " ", "/ ", formatFileSize(selectedFile?.size || 1000000)] }), _jsx("span", { children: "Speed: 14.8 MB/s" })] })] })] }) })) })] }));
}
