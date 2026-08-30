// VIBYFY Mood Design System & Theme Tokens

export const MOOD_THEMES = {
  happy: {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    tagline: "Feel the Joy & Upbeat Energy",
    color: "#F59E0B", // Amber / Warm Yellow
    accent: "from-amber-500 via-orange-500 to-yellow-400",
    bgGradient: "from-amber-950/40 via-slate-950 to-orange-950/30",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    glowColor: "rgba(245, 158, 11, 0.4)",
    keywords: ["Happy", "Joyful", "Uplifting", "Dance", "Feel Good"],
    reliefTargets: ["calm", "energetic", "love"],
  },
  sad: {
    id: "sad",
    name: "Sad",
    emoji: "😢",
    tagline: "Soulful Melodies & Melancholic Comfort",
    color: "#3B82F6", // Sapphire Blue
    accent: "from-blue-600 via-indigo-500 to-cyan-400",
    bgGradient: "from-blue-950/40 via-slate-950 to-indigo-950/30",
    badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    glowColor: "rgba(59, 130, 246, 0.4)",
    keywords: ["Soulful", "Pathos", "Healing", "Acoustic", "Comforting"],
    reliefTargets: ["calm", "happy", "energetic"],
  },
  angry: {
    id: "angry",
    name: "Angry",
    emoji: "😡",
    tagline: "High-Energy Release & Intense Beats",
    color: "#EF4444", // Crimson Red
    accent: "from-red-600 via-rose-500 to-orange-500",
    bgGradient: "from-red-950/40 via-slate-950 to-rose-950/30",
    badgeBg: "bg-red-500/10 border-red-500/30 text-red-300",
    glowColor: "rgba(239, 68, 68, 0.4)",
    keywords: ["Rock", "Metal", "Heavy Beat", "Intensity", "Adrenaline"],
    reliefTargets: ["calm", "neutral", "happy"],
  },
  calm: {
    id: "calm",
    name: "Calm",
    emoji: "😌",
    tagline: "Peaceful Serenity & Mindful Harmony",
    color: "#10B981", // Emerald Green
    accent: "from-emerald-500 via-teal-400 to-cyan-500",
    bgGradient: "from-emerald-950/40 via-slate-950 to-teal-950/30",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    glowColor: "rgba(16, 185, 129, 0.4)",
    keywords: ["Ambient", "Chill", "Lo-Fi", "Melody", "Acoustic"],
    reliefTargets: ["happy", "energetic", "love"],
  },
  stressed: {
    id: "stressed",
    name: "Stressed",
    emoji: "😰",
    tagline: "Soothing Waves & Anxious Relief",
    color: "#8B5CF6", // Royal Purple
    accent: "from-purple-600 via-violet-500 to-indigo-400",
    bgGradient: "from-purple-950/40 via-slate-950 to-violet-950/30",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    glowColor: "rgba(139, 92, 246, 0.4)",
    keywords: ["Instrumental", "Soothing", "Focus", "Deep Relax", "Soft"],
    reliefTargets: ["calm", "happy"],
  },
  excited: {
    id: "excited",
    name: "Excited",
    emoji: "⚡",
    tagline: "Electric Euphoria & Party Anthems",
    color: "#F97316", // Neon Orange
    accent: "from-orange-500 via-amber-400 to-yellow-500",
    bgGradient: "from-orange-950/40 via-slate-950 to-yellow-950/30",
    badgeBg: "bg-orange-500/10 border-orange-500/30 text-orange-300",
    glowColor: "rgba(249, 115, 22, 0.4)",
    keywords: ["Kuthu", "Party", "Upbeat", "EDM", "Club"],
    reliefTargets: ["happy", "calm"],
  },
  neutral: {
    id: "neutral",
    name: "Neutral",
    emoji: "🙂",
    tagline: "Balanced Flow & Everyday Soundscapes",
    color: "#6366F1", // Violet Indigo
    accent: "from-indigo-500 via-purple-500 to-pink-500",
    bgGradient: "from-indigo-950/40 via-slate-950 to-purple-950/30",
    badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
    glowColor: "rgba(99, 102, 241, 0.4)",
    keywords: ["Pop", "Melody", "Fusion", "Folk", "Trends"],
    reliefTargets: ["happy", "calm", "excited"],
  },
  fearful: {
    id: "fearful",
    name: "Fearful",
    emoji: "😨",
    tagline: "Grounding Rhythms & Reassuring Sound",
    color: "#06B6D4", // Cyan
    accent: "from-cyan-500 via-teal-500 to-blue-500",
    bgGradient: "from-cyan-950/40 via-slate-950 to-blue-950/30",
    badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    glowColor: "rgba(6, 182, 212, 0.4)",
    keywords: ["Reassuring", "Grounding", "Soft Melody", "Safe Haven"],
    reliefTargets: ["calm", "happy"],
  },
  surprised: {
    id: "surprised",
    name: "Surprised",
    emoji: "😲",
    tagline: "Dynamic Discoveries & Fresh Wave",
    color: "#EC4899", // Pink
    accent: "from-pink-500 via-rose-500 to-fuchsia-500",
    bgGradient: "from-pink-950/40 via-slate-950 to-fuchsia-950/30",
    badgeBg: "bg-pink-500/10 border-pink-500/30 text-pink-300",
    glowColor: "rgba(236, 72, 153, 0.4)",
    keywords: ["Fresh Hits", "Experimental", "Pop", "Indie Fusion"],
    reliefTargets: ["happy", "excited"],
  },
  disgusted: {
    id: "disgusted",
    name: "Disgusted",
    emoji: "🤢",
    tagline: "Refreshing Cleansing Soundscapes",
    color: "#84CC16", // Lime
    accent: "from-lime-500 via-emerald-500 to-teal-400",
    bgGradient: "from-lime-950/40 via-slate-950 to-emerald-950/30",
    badgeBg: "bg-lime-500/10 border-lime-500/30 text-lime-300",
    glowColor: "rgba(132, 204, 22, 0.4)",
    keywords: ["Cleanse", "Acoustic", "Nature Waves", "Fresh Vibes"],
    reliefTargets: ["calm", "happy"],
  },
};

export const getMoodTheme = (mood) => {
  if (!mood) return MOOD_THEMES.neutral;
  const key = mood.toLowerCase();
  return MOOD_THEMES[key] || MOOD_THEMES.neutral;
};

export const MOOD_JOURNEYS = [
  {
    id: "sad-to-calm",
    from: "sad",
    to: "calm",
    title: "Sad → Calm",
    description: "Gentle transition from heavy sadness to serene peace.",
    fromEmoji: "😢",
    toEmoji: "😌",
    color: "from-blue-500 to-emerald-500",
  },
  {
    id: "stressed-to-relaxed",
    from: "stressed",
    to: "calm",
    title: "Stressed → Relaxed",
    description: "Melt away tension with ambient frequencies and soothing acoustic tracks.",
    fromEmoji: "😰",
    toEmoji: "🌿",
    color: "from-purple-500 to-teal-400",
  },
  {
    id: "angry-to-peaceful",
    from: "angry",
    to: "calm",
    title: "Angry → Peaceful",
    description: "Release raw tension into soothing meditative harmony.",
    fromEmoji: "😡",
    toEmoji: "🕊️",
    color: "from-red-500 to-emerald-400",
  },
  {
    id: "tired-to-energized",
    from: "neutral",
    to: "excited",
    title: "Tired → Energized",
    description: "Ignite your spirit with rhythmic beats and motivating anthems.",
    fromEmoji: "😴",
    toEmoji: "⚡",
    color: "from-indigo-500 to-amber-400",
  },
];
