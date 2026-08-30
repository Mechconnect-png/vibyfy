import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VibyfyLogo from "./VibyfyLogo";

export const SplashScreen = ({ onComplete, duration = 2400 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); // Allow fade-out animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient Glowing Background Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-purple-600/30 via-pink-600/20 to-cyan-500/20 blur-[100px] pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
            {/* Logo Scaling & Fade In */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <VibyfyLogo size="xlarge" showText={false} animated={true} />
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl font-extrabold text-white mt-6 tracking-tight font-sans"
            >
              VIBY<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">FY</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-sm md:text-base font-medium text-slate-300 mt-2 tracking-wide"
            >
              Feel the vibe. Find your sound.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-xs text-slate-500 mt-1 uppercase tracking-widest"
            >
              Music for every moment
            </motion.p>

            {/* Sound Wave Frequency Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex items-center justify-center gap-1.5 mt-8 h-8"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    height: ["10px", "28px", "8px", "22px", "10px"],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: i * 0.12,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-cyan-400"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
