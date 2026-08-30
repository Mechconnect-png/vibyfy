// VIBYFY Mood to Spotify Search Intent Mapping (Tamil-Focused & Emotionally Relevant)

export const MOOD_MUSIC_MAP = {
  sad: {
    queries: [
      "Tamil sad songs",
      "Tamil emotional songs",
      "Tamil heartbreak melodies",
      "Tamil soulful pathos",
      "Tamil comforting songs",
    ],
    fallbackKeywords: ["sad", "emotional", "soulful", "pathos", "melody"],
  },
  happy: {
    queries: [
      "Tamil happy songs",
      "Tamil feel good songs",
      "Tamil celebration songs",
      "Tamil upbeat dance hits",
      "Tamil joy melodies",
    ],
    fallbackKeywords: ["happy", "feelgood", "celebration", "upbeat", "joy"],
  },
  angry: {
    matchQueries: [
      "Tamil intense rock",
      "Tamil heavy beat songs",
      "Tamil raw energy anthems",
    ],
    changeQueries: [
      "Tamil calm songs",
      "Tamil relaxing melodies",
      "Tamil peaceful instrumental",
      "Tamil soothing acoustic",
    ],
    queries: [
      "Tamil calm songs",
      "Tamil relaxing melodies",
      "Tamil peaceful instrumental",
      "Tamil soothing acoustic",
    ],
    fallbackKeywords: ["calm", "relaxing", "peaceful", "soothing"],
  },
  calm: {
    queries: [
      "Tamil peaceful songs",
      "Tamil acoustic melodies",
      "Tamil relaxing chill",
      "Tamil lo-fi acoustic",
      "Tamil gentle breeze songs",
    ],
    fallbackKeywords: ["peaceful", "chill", "acoustic", "lofi"],
  },
  stressed: {
    queries: [
      "Tamil relaxing songs",
      "Tamil instrumental music",
      "Tamil peaceful melodies",
      "Tamil stress relief ambient",
      "Tamil soothing flute melody",
    ],
    fallbackKeywords: ["relaxing", "instrumental", "soothing", "ambient"],
  },
  excited: {
    queries: [
      "Tamil energetic songs",
      "Tamil workout hits",
      "Tamil party kuthu beats",
      "Tamil high energy anthems",
      "Tamil club dance hits",
    ],
    fallbackKeywords: ["kuthu", "party", "energetic", "workout"],
  },
  neutral: {
    queries: [
      "Tamil trending songs",
      "Tamil top melodies",
      "Tamil popular hits",
      "Tamil indie fusion",
    ],
    fallbackKeywords: ["trending", "popular", "melody"],
  },
  fearful: {
    queries: [
      "Tamil reassuring melodies",
      "Tamil peaceful acoustic",
      "Tamil gentle soothing songs",
    ],
    fallbackKeywords: ["soothing", "peaceful"],
  },
  surprised: {
    queries: [
      "Tamil fresh wave pop",
      "Tamil innovative melodies",
      "Tamil experimental fusion",
    ],
    fallbackKeywords: ["fresh", "pop", "fusion"],
  },
  disgusted: {
    queries: [
      "Tamil cleansing nature melodies",
      "Tamil acoustic soothing tracks",
    ],
    fallbackKeywords: ["nature", "acoustic"],
  },
};

export const getQueriesForMood = (mood, mode = "default") => {
  if (!mood) return MOOD_MUSIC_MAP.neutral.queries;
  const key = mood.toLowerCase();
  const config = MOOD_MUSIC_MAP[key] || MOOD_MUSIC_MAP.neutral;

  if (key === "angry" && mode === "match") {
    return config.matchQueries || config.queries;
  }
  return config.queries;
};
