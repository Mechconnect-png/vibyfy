import { supabase } from "../lib/supabase";

export const getDailyMix = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Get recent play history
  const { data: history, error } = await supabase
    .from("play_history")
    .select(`
      song_id,
      songs(*)
    `)
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .limit(30);

  if (error || !history) {
    console.error(error);
    return [];
  }

  const songs = history
    .map((item) => item.songs)
    .filter(Boolean);

  if (songs.length === 0) return [];

  // Count moods
  const moodCount = {};

  songs.forEach((song) => {
    if (!song.mood) return;

    moodCount[song.mood] =
      (moodCount[song.mood] || 0) + 1;
  });

  const favoriteMood =
    Object.keys(moodCount).sort(
      (a, b) => moodCount[b] - moodCount[a]
    )[0];

  if (!favoriteMood) return [];

  // Get more songs with same mood
  const { data: recommendations } = await supabase
    .from("songs")
    .select("*")
    .eq("mood", favoriteMood)
    .limit(12);

  return recommendations || [];
};