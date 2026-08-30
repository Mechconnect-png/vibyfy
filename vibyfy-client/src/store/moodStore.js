import { create } from "zustand";

const useMoodStore = create((set, get) => ({
  // ==========================================
  // STATE
  // ==========================================
  liveMood: "neutral",
  liveConfidence: 0,
  lockedMood: null,
  lockedConfidence: 0,
  isLocked: false,
  isScanning: false,
  predictionHistory: [],
  scanStartedAt: null,

  recommendations: [],
  recommendedSongs: [],
  selectedReliefTarget: null,

  // ==========================================
  // ACTIONS
  // ==========================================

  // Start continuous scanning session
  startScan: () =>
    set({
      isScanning: true,
      predictionHistory: [],
      scanStartedAt: Date.now(),
    }),

  // Stop scanning session
  stopScan: () =>
    set({
      isScanning: false,
    }),

  // Update continuous live detection
  // IMPORTANT: Does NOT modify lockedMood if isLocked is already true!
  setLivePrediction: (mood, confidence = 85) => {
    const state = get();
    if (state.isLocked) {
      // Ignore predictions once locked
      return;
    }

    const now = Date.now();
    const newEntry = { mood: mood.toLowerCase(), confidence, timestamp: now };
    const history = [...state.predictionHistory, newEntry].filter(
      (item) => now - item.timestamp <= 3000 // Keep last 3 seconds
    );

    set({
      liveMood: mood.toLowerCase(),
      liveConfidence: confidence,
      predictionHistory: history,
    });
  },

  // Evaluate rolling buffer for automatic lock
  // Requirements: Dominant mood consistent for ~1.2-1.5s with confidence >= threshold
  evaluateAutoLock: (confidenceThreshold = 75, stabilityMs = 1200) => {
    const state = get();
    if (state.isLocked || !state.isScanning) return { locked: false };

    const history = state.predictionHistory;
    if (history.length < 5) return { locked: false }; // Need at least 5 frames

    const now = Date.now();
    const recentHistory = history.filter((item) => now - item.timestamp <= stabilityMs);

    if (recentHistory.length < 4) return { locked: false };

    // Tally emotions
    const moodCounts = {};
    let totalConf = 0;

    recentHistory.forEach((item) => {
      moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
      totalConf += item.confidence;
    });

    let dominantMood = null;
    let maxCount = 0;

    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });

    const avgConfidence = Math.round(totalConf / recentHistory.length);
    const consistencyRatio = maxCount / recentHistory.length;

    // Trigger auto lock if dominant mood is >= 70% consistent and confidence >= threshold
    if (dominantMood && consistencyRatio >= 0.7 && avgConfidence >= confidenceThreshold) {
      set({
        lockedMood: dominantMood,
        lockedConfidence: avgConfidence,
        isLocked: true,
        isScanning: false,
      });

      return { locked: true, mood: dominantMood, confidence: avgConfidence };
    }

    return { locked: false };
  },

  // Explicit / Manual mood lock (fallback or manual chips)
  lockMoodManual: (mood, confidence = 95) => {
    const target = mood.toLowerCase();
    set({
      lockedMood: target,
      lockedConfidence: confidence,
      isLocked: true,
      isScanning: false,
    });
  },

  // Reset session to allow a new scan
  resetMoodScan: () =>
    set({
      liveMood: "neutral",
      liveConfidence: 0,
      lockedMood: null,
      lockedConfidence: 0,
      isLocked: false,
      isScanning: false,
      predictionHistory: [],
      scanStartedAt: null,
    }),

  // Target relief mood for Relief Zone
  setReliefTarget: (targetMood) => set({ selectedReliefTarget: targetMood }),

  setRecommendations: (songs) => set({ recommendations: songs }),
  setRecommendedSongs: (songs) => set({ recommendedSongs: songs }),
}));

export default useMoodStore;