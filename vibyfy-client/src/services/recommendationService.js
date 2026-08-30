import { supabase } from "../lib/supabase";

export const getRecommendations = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Get recent play history
  const { data: history } = await supabase
    .from("play_history")
    .select(`
      song_id,
      songs(*)
    `)
    .eq("user_id", user.id)
    .limit(50);

  if (!history || history.length === 0) {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .limit(12);

    return data || [];
  }

  const moods = {};

  history.forEach((item) => {
    const mood = item.songs?.mood;

    if (!mood) return;

    moods[mood] = (moods[mood] || 0) + 1;
  });

  const favoriteMood = Object.keys(moods).sort(
    (a, b) => moods[b] - moods[a]
  )[0];

  const playedIds = history.map((h) => h.song_id);

  const { data } = await supabase
    .from("songs")
    .select("*")
    .eq("mood", favoriteMood)
    .limit(20);

  return (data || []).filter(
    (song) => !playedIds.includes(song.id)
  );
};