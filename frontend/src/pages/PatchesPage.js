import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { usePatchStore } from '@/store/usePatchStore';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
function PatchesPage() {
    const { currentVideoId, patches, fetchPatches, isLoading, error } = usePatchStore();
    useEffect(() => {
        if (currentVideoId) {
            fetchPatches(currentVideoId);
        }
    }, [currentVideoId, fetchPatches]);
    const handleRefresh = () => {
        if (currentVideoId)
            fetchPatches(currentVideoId);
    };
    return (_jsxs(motion.div, { className: "space-y-6 p-6", initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold text-text", children: "Patches" }), _jsxs("button", { onClick: handleRefresh, className: "flex items-center gap-1 text-sm text-primary hover:text-primary-hover", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), " Refresh"] })] }), isLoading && _jsx("div", { className: "text-muted", children: "Loading patches..." }), error && _jsxs("div", { className: "text-danger", children: ["Error: ", error] }), !isLoading && !error && patches.length === 0 && (_jsx("div", { className: "text-muted", children: "No patches available for this video." })), _jsx("div", { className: "grid grid-cols-1 gap-4", children: patches.map((p) => (_jsxs("div", { className: "glass-card p-4 rounded-xl border border-border", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-semibold text-text", children: ["Patch ", p.patch_id] }), _jsx("span", { className: "text-xs font-medium text-muted", children: p.status })] }), _jsx("p", { className: "mt-2 text-sm text-text", children: p.prompt }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-2 text-xs", children: [_jsxs("span", { children: ["Occurrences: ", p.occurrences_count] }), _jsxs("span", { children: ["Confidence: ", p.confidence_score, "%"] })] })] }, p.patch_id))) })] }));
}
export default PatchesPage;
