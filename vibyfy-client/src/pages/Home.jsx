import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Lock } from "lucide-react";
import useMoodStore from "../store/moodStore";
import useUsageStore from "../store/usageStore";
import useSubscriptionStore from "../store/subscriptionStore";
import { getMoodTheme, MOOD_THEMES, MOOD_JOURNEYS } from "../theme/moods";
import { discoverByMood } from "../services/musicDiscoveryService";
import SongCard, { SongCardSkeleton } from "../components/cards/SongCard";
import LoadMoreButton from "../components/cards/LoadMoreButton";
import MoodScanner from "../components/ai/MoodScanner";
import UsageIndicator from "../components/common/UsageIndicator";
import SpotifyConnectBadge from "../components/common/SpotifyConnectBadge";
import DailyLimitModal from "../components/modals/DailyLimitModal";
import PremiumModal from "../components/modals/PremiumModal";

export const Home = () => {
  const navigate = useNavigate();
  const { lockedMood, isLocked, liveMood, lockMoodManual, setReliefTarget } = useMoodStore();
  const { canStartMoodScan, recordMoodScan, fetchUsageStatus } = useUsageStore();

  const [recommendations, setRecommendations] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  
  // Modals
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const activeMood = isLocked ? lockedMood : (liveMood || "neutral");
  const activeTheme = getMoodTheme(activeMood);

  useEffect(() => {
    fetchUsageStatus();
  }, [fetchUsageStatus]);

  // Initial Load (10 Songs)
  useEffect(() => {
    let isMounted = true;
    setLoadingSongs(true);
    setOffset(0);

    discoverByMood(activeMood, 10, 0)
      .then((res) => {
        if (isMounted) {
          setRecommendations(res.songs || []);
          setHasMore(res.hasMore);
          setLoadingSongs(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load recommendations:", err);
        if (isMounted) setLoadingSongs(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeMood]);

  // Load More Songs Pagination
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextOffset = offset + 10;
    const res = await discoverByMood(activeMood, 10, nextOffset);

    // Merge and deduplicate by spotifyId
    const existingIds = new Set(recommendations.map((s) => s.spotifyId || s.id));
    const uniqueNew = (res.songs || []).filter((s) => !existingIds.has(s.spotifyId || s.id));

    setRecommendations((prev) => [...prev, ...uniqueNew]);
    setOffset(nextOffset);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  };

  const handleLaunchScanner = () => {
    if (!canStartMoodScan()) {
      setShowLimitModal(true);
      return;
    }
    setShowScanner(true);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleManualSelect = (mVal) => {
    if (!canStartMoodScan()) {
      setShowLimitModal(true);
      return;
    }
    recordMoodScan();
    lockMoodManual(mVal);
  };

  const handleStartJourney = (journey) => {
    lockMoodManual(journey.from);
    setReliefTarget(journey.to);
    navigate("/relief");
  };

  return (
    <div className="space-y-12 pb-24">
      {/* MODALS */}
      <DailyLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        target="scan"
        onUnlockSuccess={() => setShowLimitModal(false)}
      />
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />

      {/* HERO SECTION — SCAN MY VIBE CTA */}
      <section className="relative rounded-3xl bg-slate-900/90 border border-slate-800/80 p-8 md:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-25 ${activeTheme.accent}`} />
        
        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <Sparkles size={15} />
                <span>AI Mood Intelligence Engine</span>
              </div>

              {/* Usage Indicator Badge */}
              <UsageIndicator
                target="scan"
                onOpenPremium={() => setShowPremiumModal(true)}
                onOpenLimitModal={() => setShowLimitModal(true)}
              />

              {/* Spotify Player Connection Status Badge */}
              <SpotifyConnectBadge />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight font-sans leading-tight">
              Feel the vibe. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                Find your sound.
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-lg mx-auto lg:mx-0 font-medium">
              VIBYFY analyzes how you feel right now and delivers personalized audio soundscapes matching your moment.
            </p>

            {/* Locked Mood Banner if present */}
            {isLocked && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <Lock size={15} />
                <span>Session Vibe Locked to <strong className="uppercase">{lockedMood}</strong></span>
              </div>
            )}
          </div>

          {/* Right Hero Circular CTA Button */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border-2 border-purple-500/40 w-48 h-48 md:w-56 md:h-56 -m-4 md:-m-4 pointer-events-none"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLaunchScanner}
                className="relative z-10 w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 p-1 shadow-2xl shadow-purple-600/40 flex flex-col items-center justify-center text-white text-center cursor-pointer group"
              >
                <div className="w-full h-full rounded-full bg-slate-950/90 group-hover:bg-slate-950/70 transition flex flex-col items-center justify-center p-4">
                  <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🎵</div>
                  <span className="font-extrabold text-sm md:text-base tracking-wider text-white">
                    SCAN MY VIBE
                  </span>
                  <span className="text-[10px] text-purple-300 mt-1 uppercase font-semibold">
                    Instant AI Camera
                  </span>
                </div>
              </motion.button>
            </div>

            <p className="text-xs text-slate-400 mt-6 text-center font-medium">
              Click to check limit & launch camera scanner
            </p>
          </div>
        </div>
      </section>

      {/* AI MOOD SCANNER DISPLAY */}
      {showScanner && (
        <section id="mood-scanner-section">
          <MoodScanner
            onDiscoveryRequested={() => {
              recordMoodScan();
              window.scrollTo({ top: 800, behavior: "smooth" });
            }}
          />
        </section>
      )}

      {/* MANUAL VIBE SELECTION CHIPS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Choose Your Vibe Manually</h2>
          <span className="text-xs text-slate-400">Select any emotion to update recommendations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.values(MOOD_THEMES).map((m) => {
            const isSelected = activeMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleManualSelect(m.id)}
                className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/40 text-white shadow-lg"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-bold capitalize">{m.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* MOOD JOURNEYS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Mood Journeys</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transform how you feel by traveling from one state to another.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOOD_JOURNEYS.map((j) => (
            <div
              key={j.id}
              onClick={() => handleStartJourney(j)}
              className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-2xl">
                  <span>{j.fromEmoji}</span>
                  <span className="text-slate-500 text-sm">→</span>
                  <span>{j.toEmoji}</span>
                </div>
                <span className="p-2 rounded-xl bg-slate-800 group-hover:bg-purple-600 text-slate-300 group-hover:text-white transition">
                  <ArrowRight size={16} />
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition">
                  {j.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{j.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DISCOVER YOUR VIBE — PAGINATED MUSIC RECOMMENDATIONS */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeTheme.emoji}</span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Discover Your Vibe: <span className="capitalize">{activeMood}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">{activeTheme.tagline}</p>
          </div>

          <button
            onClick={() => navigate("/mood")}
            className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition"
          >
            <span>Launch AI Scanner</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Songs Grid */}
        {loadingSongs ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <SongCardSkeleton key={i} />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommendations.map((song, idx) => (
                <SongCard key={song.spotifyId || song.id} song={song} index={idx} />
              ))}
            </div>

            {/* Load More Button */}
            <LoadMoreButton
              onClick={handleLoadMore}
              isLoading={loadingMore}
              hasMore={hasMore}
            />
          </>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <p className="text-slate-400 text-sm">No specific tracks found for this vibe.</p>
            <button
              onClick={() => handleManualSelect("happy")}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Try Happy Vibe
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;