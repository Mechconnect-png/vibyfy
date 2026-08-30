import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, CheckCircle2, Sparkles, Infinity, ShieldCheck, X } from "lucide-react";
import useSubscriptionStore from "../../store/subscriptionStore";

export const PremiumModal = ({ isOpen, onClose }) => {
  const { isPremium, upgradeToPremium, downgradeToFree } = useSubscriptionStore();

  if (!isOpen) return null;

  const handleTogglePlan = () => {
    if (isPremium) {
      downgradeToFree();
    } else {
      upgradeToPremium();
    }
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950/60 border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden space-y-6 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition"
          >
            <X size={18} />
          </button>

          {/* Crown Badge */}
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
            <Crown size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              VIBYFY PREMIUM
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Feel more. Discover deeper.
            </h2>
            <p className="text-slate-300 text-xs md:text-sm font-medium">
              Unlock the complete AI-powered music discovery experience with zero limits.
            </p>
          </div>

          {/* Features List */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 text-left space-y-3 text-sm">
            {[
              "∞ Unlimited Mood Insights & Camera Scans",
              "📊 Advanced Mood History Analytics",
              "🎵 Personalized Mood Journey Engine",
              "✨ Advanced Spotify Multi-Intent Recommendations",
              "🚫 Ad-Free Seamless Experience",
              "🎯 Custom Mood Target Goals in Relief Zone",
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="font-semibold text-xs md:text-sm">{feat}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleTogglePlan}
              className="w-full bg-gradient-to-r from-amber-500 via-purple-600 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-purple-600/30 text-sm md:text-base transition"
            >
              {isPremium ? "SWITCH TO FREE PLAN (DEV MOCK)" : "UPGRADE TO VIBYFY PREMIUM"}
            </button>

            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 transition block mx-auto"
            >
              Continue with Free Version
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumModal;
