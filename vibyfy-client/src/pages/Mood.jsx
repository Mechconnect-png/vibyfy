import React, { useEffect, useState } from "react";
import { Smile, Brain, Music, TrendingUp } from "lucide-react";
import MoodScanner from "../components/ai/MoodScanner";
import useMoodStore from "../store/moodStore";
import { getRecommendationsForMood } from "../services/musicDiscoveryService";
import SongCard, { SongCardSkeleton } from "../components/cards/SongCard";
import LoadMoreButton from "../components/cards/LoadMoreButton";
import { getMoodTheme } from "../theme/moods";

export const Mood = () => {
  const { lockedMood, liveMood, isLocked, lockedConfidence, liveConfidence } = useMoodStore();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const activeMood = isLocked ? lockedMood : (liveMood || "neutral");
  const moodTheme = getMoodTheme(activeMood);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setOffset(0);

    getRecommendationsForMood(activeMood, null, 10, 0)
      .then((res) => {
        if (active) {
          const songsList = Array.isArray(res) ? res : (res?.songs || []);
          setRecommendations(songsList);
          setHasMore(res?.hasMore ?? false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Mood page recommendations error:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeMood]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextOffset = offset + 10;
    const res = await getRecommendationsForMood(activeMood, null, 10, nextOffset);
    const newSongs = Array.isArray(res) ? res : (res?.songs || []);

    const existingIds = new Set(recommendations.map((s) => s.spotifyId || s.id));
    const uniqueNew = newSongs.filter((s) => !existingIds.has(s.spotifyId || s.id));

    setRecommendations((prev) => [...prev, ...uniqueNew]);
    setOffset(nextOffset);
    setHasMore(res?.hasMore ?? false);
    setLoadingMore(false);
  };

  const safeRecommendationsList = Array.isArray(recommendations) ? recommendations : [];

  return (
    <div className="pb-24 space-y-10">
      {/* Title Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{moodTheme.emoji}</span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            AI Mood Intelligence Scanner
          </h1>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          Real-time facial expression analysis with Automatic Mood Lock for instant personalized discovery.
        </p>
      </div>

      {/* Camera & Scanner Component */}
      <MoodScanner />

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-2">
          <div className="text-purple-400">
            <Smile size={24} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Vibe State</p>
          <p className="text-2xl font-black text-white capitalize">{activeMood}</p>
          <p className="text-xs text-slate-500">{isLocked ? "Locked to Session" : "Live Camera Analysis"}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-2">
          <div className="text-pink-400">
            <Brain size={24} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Confidence Score</p>
          <p className="text-2xl font-black text-white">{isLocked ? lockedConfidence : liveConfidence}%</p>
          <p className="text-xs text-slate-500">Local Browser Face-API Engine</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-2">
          <div className="text-cyan-400">
            <TrendingUp size={24} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Auto Lock Status</p>
          <p className="text-2xl font-black text-emerald-400">{isLocked ? "LOCKED 🔒" : "SCANNING ⚡"}</p>
          <p className="text-xs text-slate-500">{isLocked ? "lockedMood is Immutable" : "Continuous Rolling Window"}</p>
        </div>
      </div>

      {/* Recommendations Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Music className="text-purple-400" size={24} />
          <h2 className="text-2xl font-bold text-white capitalize">
            {activeMood} Recommended Soundscape
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <SongCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {safeRecommendationsList.map((song, idx) => (
                <SongCard key={song.spotifyId || song.id} song={song} index={idx} />
              ))}
            </div>

            <LoadMoreButton
              onClick={handleLoadMore}
              isLoading={loadingMore}
              hasMore={hasMore}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Mood;