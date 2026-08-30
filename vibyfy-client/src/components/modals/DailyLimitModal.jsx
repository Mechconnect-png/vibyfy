import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Tv, Crown, X } from "lucide-react";
import useSubscriptionStore from "../../store/subscriptionStore";
import useUsageStore from "../../store/usageStore";
import { showRewardedAd } from "../../services/adService";
import toast from "react-hot-toast";

export const DailyLimitModal = ({ isOpen, onClose, target = "scan", onUnlockSuccess }) => {
  const { isPremium, upgradeToPremium } = useSubscriptionStore();
  const { usage, watchAd } = useUsageStore();
  const [adProgress, setAdProgress] = useState(0); // 0, 1, 2
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [showRewardSuccess, setShowRewardSuccess] = useState(false);

  if (!isOpen || isPremium) return null;

  const title = target === "relief" ? "DAILY RELIEF LIMIT REACHED" : "DAILY VIBE LIMIT REACHED";
  const desc = target === "relief"
    ? "You've completed 5 daily Relief Journeys. Unlock more sessions by watching rewarded ads or upgrading to VIBYFY Premium."
    : "You've explored 5 vibes today. Unlock another vibe scan by watching 2 quick rewarded ads or going Premium for unlimited scans.";

  const handleWatchAd = () => {
    setIsWatchingAd(true);

    showRewardedAd({
      target,
      context: "limit_modal",
      onStateChange: (state) => {
        console.log("📺 AD MODAL STATE CHANGE:", state);
      },
      onComplete: async (reward) => {
        setIsWatchingAd(false);
        console.log("🎉 AD COMPLETED ON MODAL:", reward);
        
        // Record completed ad in usage store & backend
        await watchAd(target);

        const currentCount = adProgress + 1;
        if (currentCount >= 2) {
          setAdProgress(2);
          setShowRewardSuccess(true);
          if (onUnlockSuccess) onUnlockSuccess();
        } else {
          setAdProgress(currentCount);
          toast.success(`Ad 1 of 2 Complete! Watch 1 more ad to unlock.`, { icon: "📺" });
        }
      },
      onError: (err) => {
        setIsWatchingAd(false);
        toast.error(`Ad Error: ${err.message}`);
      },
    });
  };

  const handleUpgrade = async () => {
    await upgradeToPremium();
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden space-y-6 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition"
          >
            <X size={18} />
          </button>

          {/* Header Icon */}
          <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-xl">
            <Lock size={32} />
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              VIBYFY Freemium System
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {title}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed max-w-sm mx-auto">
              {desc}
            </p>
          </div>

          {/* Usage Tracker Badge */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Today's Usage:</span>
            <span className="font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              {target === "relief" ? `${usage.reliefSessionsUsed} / ${usage.totalAllowedRelief}` : `${usage.moodScansUsed} / ${usage.totalAllowedScans}`} Used
            </span>
          </div>

          {/* Reward Success State */}
          {showRewardSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
              <div className="text-3xl">🎉</div>
              <h3 className="text-lg font-bold text-white">EXTRA VIBE UNLOCKED!</h3>
              <p className="text-xs text-emerald-300 font-medium">
                You've unlocked 1 additional {target === "relief" ? "Relief Journey" : "Mood Scan"}.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg"
              >
                Continue Scanning
              </button>
            </div>
          ) : (
            /* Action Buttons */
            <div className="space-y-3 pt-2">
              {/* WATCH ADS BUTTON */}
              <button
                onClick={handleWatchAd}
                disabled={isWatchingAd}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-purple-600/30 text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Tv size={18} />
                <span>
                  {isWatchingAd ? "Simulating Ad Stream (3s)..." : `Watch Ad to Unlock (${adProgress}/2 Completed)`}
                </span>
              </button>

              {/* GO PREMIUM BUTTON */}
              <button
                onClick={handleUpgrade}
                className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-3 px-6 rounded-2xl border border-amber-500/30 text-sm transition flex items-center justify-center gap-2"
              >
                <Crown size={18} className="text-amber-400" />
                <span>Go Premium for Unlimited Scans</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DailyLimitModal;
