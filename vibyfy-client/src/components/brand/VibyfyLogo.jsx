import React from "react";
import { motion } from "framer-motion";

export const VibyfyLogo = ({ size = "medium", showText = true, animated = true, className = "" }) => {
  const sizeMap = {
    small: { icon: 24, text: "text-lg", spacing: "gap-2" },
    medium: { icon: 34, text: "text-2xl", spacing: "gap-3" },
    large: { icon: 48, text: "text-3xl", spacing: "gap-3.5" },
    xlarge: { icon: 68, text: "text-5xl", spacing: "gap-5" },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  return (
    <div className={`flex items-center ${currentSize.spacing} select-none ${className}`}>
      {/* Logo Icon Mark */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Glow backdrop */}
        {animated && (
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.4, 0.75, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 blur-md opacity-50"
          />
        )}

        {/* SVG Graphic Symbol */}
        <div
          style={{ width: currentSize.icon, height: currentSize.icon }}
          className="relative bg-slate-950/90 border border-purple-500/40 rounded-2xl p-1.5 shadow-2xl flex items-center justify-center backdrop-blur-md"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="vibyfy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="wave-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>

            {/* Sound Wave V Shape */}
            <path
              d="M15 25 L45 78 L55 78 L85 25"
              stroke="url(#vibyfy-grad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Center Sound Frequency Bars inside the V */}
            <rect x="35" y="32" width="6" height="22" rx="3" fill="url(#wave-grad)" />
            <rect x="47" y="24" width="6" height="36" rx="3" fill="url(#vibyfy-grad)" />
            <rect x="59" y="32" width="6" height="22" rx="3" fill="url(#wave-grad)" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-black tracking-tight ${currentSize.text} text-white font-sans`}>
          VIBY<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">FY</span>
        </span>
      )}
    </div>
  );
};

export default VibyfyLogo;
