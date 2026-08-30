import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

export const PremiumModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-500/20 blur-[80px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 border border-amber-400/40 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Crown size={30} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">VIBYFY Pro Experience</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Elevate your mood discovery with advanced AI personalization and custom soundscapes.
            </p>
          </div>

          {/* Feature Comparison */}
          <div className="space-y-3 mb-6">
            {[
              "Unlimited AI facial expression scanning & auto-locking",
              "Advanced multi-step Relief Zone mood journeys",
              "Custom ambient visualizer color themes",
              "Priority Spotify recommendation matching",
              "Ad-free VIBYFY experience",
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* CTA Action */}
          <div className="space-y-3">
            <button
              onClick={() => {
                alert("Thank you for exploring VIBYFY Pro MVP!");
                onClose();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/30 text-sm transition"
            >
              Start 14-Day Free Pro Trial
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Cancel anytime. Spotify app external listening terms apply.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumModal;
