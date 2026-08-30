import React from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";

export const LoadMoreButton = ({ onClick, isLoading, hasMore }) => {
  if (!hasMore) {
    return (
      <div className="text-center py-6">
        <p className="text-xs font-semibold text-slate-500 italic">
          ✨ You've explored all current recommendations for this vibe.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-6">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-purple-300 hover:text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-xl text-sm disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin text-purple-400" />
            <span>Fetching More Tracks...</span>
          </>
        ) : (
          <>
            <Plus size={18} />
            <span>Load More Songs</span>
          </>
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;
