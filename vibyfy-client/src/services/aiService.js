import { supabase } from "../lib/supabase";

export const getMoodSongs = async (mood) => {
  const moodMap = {
    happy: "happy",
    sad: "relief",
    angry: "calm",
    fearful: "calm",
    disgusted: "calm",
    surprised: "energetic",
    neutral: "chill",
  };

  const dbMood = moodMap[mood] || "chill";

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("mood", dbMood);

  if (error) throw error;

  return (data || []).map(song => ({
    ...song,
    audio: song.audio_url,
  }));
};