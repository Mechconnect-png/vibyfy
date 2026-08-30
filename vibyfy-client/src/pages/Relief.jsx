import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, ArrowRight, Sparkles, Lock, Camera, CheckCircle2 } from "lucide-react";
import useMoodStore from "../store/moodStore";
import useUsageStore from "../store/usageStore";
import useSubscriptionStore from "../store/subscriptionStore";
import { getMoodTheme } from "../theme/moods";
import { getRecommendationsForMood } from "../services/musicDiscoveryService";
import SongCard, { SongCardSkeleton } from "../components/cards/SongCard";
import LoadMoreButton from "../components/cards/LoadMoreButton";
import MoodScanner from "../components/ai/MoodScanner";
import UsageIndicator from "../components/common/UsageIndicator";
import DailyLimitModal from "../components/modals/DailyLimitModal";
import PremiumModal from "../components/modals/PremiumModal";

const RELIEF_OPTIONS = [
  { id: "calm", name: "Calm & Serene", emoji: "😌", desc: "Soothe tension with peaceful melodies" },
  { id: "happy", name: "Feel Joyful", emoji: "😊", desc: "Lift your spirits with upbeat energy" },
  { id: "energetic", name: "Motivated", emoji: "⚡", desc: "Ignite focus and high energy" },
  { id: "stressed", name: "Relaxed & Mindful", emoji: "🌿", desc: "Deep relaxation and ambient waves" },
];

export const Relief = () => {
  const { lockedMood, isLocked, liveMood, selectedReliefTarget, setReliefTarget } = useMoodStore();
  const { canStartReliefSession, recordReliefSession, canStartMoodScan, fetchUsageStatus } = useUsageStore();
  const { isPremium } = useSubscriptionStore();

  const currentMood = isLocked ? lockedMood : (liveMood || "sad");
  const [targetMood, setTargetMood] = useState(selectedReliefTarget || "calm");
  
  const [journeySongs, setJourneySongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [showScanner, setShowScanner] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const currentTheme = getMoodTheme(currentMood);
  const targetTheme = getMoodTheme(targetMood);

  useEffect(() => {
    fetchUsageStatus();
  }, [fetchUsageStatus]);

  // Initial Load (10 Songs)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setOffset(0);

    getRecommendationsForMood(currentMood, targetMood, 10, 0)
      .then((res) => {
        if (isMounted) {
          setJourneySongs(res.songs || []);
          setHasMore(res.hasMore);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load relief songs:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentMood, targetMood]);

  // Pagination
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextOffset = offset + 10;
    const res = await getRecommendationsForMood(currentMood, targetMood, 10, nextOffset);

    const existingIds = new Set(journeySongs.map((s) => s.spotifyId || s.id));
    const uniqueNew = (res.songs || []).filter((s) => !existingIds.has(s.spotifyId || s.id));

    setJourneySongs((prev) => [...prev, ...uniqueNew]);
    setOffset(nextOffset);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  };

  const handleTargetSelect = (targetId) => {
    if (!canStartReliefSession()) {
      setShowLimitModal(true);
      return;
    }
    recordReliefSession();
    setTargetMood(targetId);
    setReliefTarget(targetId);
  };

  const handleToggleScanner = () => {
    if (!canStartMoodScan()) {
      setShowLimitModal(true);
      return;
    }
    setShowScanner(!showScanner);
  };

  return (
    <div className="space-y-10 pb-24">
      {/* MODALS */}
      <DailyLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        target="relief"
        onUnlockSuccess={() => setShowLimitModal(false)}
      />
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />

      {/* HEADER HERO */}
      <section className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-8 md:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className={`absolute top-0 left-0 w-80 h-80 rounded-full blur-[100px] opacity-30 ${currentTheme.accent}`} />
        <div className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-30 ${targetTheme.accent}`} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <HeartPulse size={16} />
                <span>VIBYFY Relief Zone</span>
              </div>

              <UsageIndicator
                target="relief"
                onOpenPremium={() => setShowPremiumModal(true)}
                onOpenLimitModal={() => setShowLimitModal(true)}
              />
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Choose how you want to feel next.
            </h1>
            <p className="text-slate-300 text-sm md:text-base font-medium">
              Scan your current expression or choose a target vibe goal to build your personalized emotional transition stream.
            </p>
          </div>

          <button
            onClick={handleToggleScanner}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-purple-600/30 text-sm transition shrink-0"
          >
            <Camera size={18} />
            <span>{showScanner ? "Close Camera Scanner" : "Scan Current Vibe"}</span>
          </button>
        </div>
      </section>

      {/* EMBEDDED AI MOOD SCANNER */}
      <AnimatePresence>
        {showScanner && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MoodScanner
              onDiscoveryRequested={() => {
                setShowScanner(false);
              }}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* VIBE JOURNEY VISUAL FLOW */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Your Emotional Journey
          </span>

          <button
            onClick={handleToggleScanner}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition"
          >
            <Sparkles size={14} />
            <span>{isLocked ? "Re-scan Vibe" : "Scan Expression"}</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* STEP 1: CURRENT VIBE */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-2 text-center relative">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              1. Current Vibe
            </span>
            <div className="text-4xl">{currentTheme.emoji}</div>
            <h3 className="font-extrabold text-white text-lg capitalize">{currentMood}</h3>
            <p className="text-xs text-slate-400">{currentTheme.tagline}</p>
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <Lock size={12} /> Auto-Locked 🔒
              </span>
            )}
          </div>

          {/* STEP 2: TRANSITION ARROW */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center animate-pulse">
              <ArrowRight size={24} />
            </div>
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Transition Flow
            </span>
          </div>

          {/* STEP 3: DESIRED TARGET MOOD */}
          <div className="bg-slate-950/90 border border-purple-500/40 rounded-2xl p-5 space-y-2 text-center relative shadow-lg shadow-purple-950/20">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
              2. Target Vibe Goal
            </span>
            <div className="text-4xl">{targetTheme.emoji}</div>
            <h3 className="font-extrabold text-white text-lg capitalize">{targetTheme.name}</h3>
            <p className="text-xs text-slate-400">{targetTheme.tagline}</p>
          </div>
        </div>
      </section>

      {/* TARGET SELECTION CHIPS */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Select Desired Target Vibe:</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RELIEF_OPTIONS.map((opt) => {
            const isSelected = targetMood === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleTargetSelect(opt.id)}
                className={`p-5 rounded-2xl border transition-all text-left space-y-2 ${
                  isSelected
                    ? "bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/40 text-white shadow-xl"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-3xl">{opt.emoji}</span>
                  {isSelected && <CheckCircle2 size={18} className="text-purple-400" />}
                </div>
                <h3 className="font-bold text-base text-white">{opt.name}</h3>
                <p className="text-xs text-slate-400">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* RECOMMENDED JOURNEY TRACKS WITH PAGINATION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Journey Soundscape: <span className="capitalize">{currentMood}</span> → <span className="capitalize">{targetMood}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Spotify tracks curated to ease emotional transition
            </p>
          </div>
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
              {journeySongs.map((song, idx) => (
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
      </section>
    </div>
  );
};

export default Relief;