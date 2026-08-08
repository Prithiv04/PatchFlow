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
    if (currentVideoId) fetchPatches(currentVideoId);
  };

  return (
    <motion.div className="space-y-6 p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Patches</h1>
        <button onClick={handleRefresh} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      {isLoading && <div className="text-muted">Loading patches...</div>}
      {error && <div className="text-danger">Error: {error}</div>}
      {!isLoading && !error && patches.length === 0 && (
        <div className="text-muted">No patches available for this video.</div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {patches.map((p) => (
          <div key={p.patch_id} className="glass-card p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">Patch {p.patch_id}</h2>
              <span className="text-xs font-medium text-muted">{p.status}</span>
            </div>
            <p className="mt-2 text-sm text-text">{p.prompt}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span>Occurrences: {p.occurrences_count}</span>
              <span>Confidence: {p.confidence_score}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default PatchesPage;
