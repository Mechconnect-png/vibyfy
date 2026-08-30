import { supabase } from "../lib/supabase";

export const getWrappedStats = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("play_history")
    .select(
      `
      played_at,
      songs (
        id,
        title,
        artist,
        mood,
        genre,
        duration
      )
    `
    )
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return null;
  }

  if (!data || data.length === 0) {
    return {
      minutes: 0,
      totalSongs: 0,
      topSong: "-",
      topArtist: "-",
      favoriteMood: "-",
      favoriteGenre: "-",
      streak: 0,
      topSongs: [],
      topArtists: [],
    };
  }

  const songCount = {};
  const artistCount = {};
  const moodCount = {};
  const genreCount = {};

  let totalMinutes = 0;

  data.forEach((item) => {
    const song = item.songs;

    if (!song) return;

    totalMinutes += song.duration || 0;

    songCount[song.title] =
      (songCount[song.title] || 0) + 1;

    artistCount[song.artist] =
      (artistCount[song.artist] || 0) + 1;

    moodCount[song.mood] =
      (moodCount[song.mood] || 0) + 1;

    genreCount[song.genre] =
      (genreCount[song.genre] || 0) + 1;
  });

  const topSong = Object.entries(songCount).sort(
    (a, b) => b[1] - a[1]
  );

  const topArtist = Object.entries(artistCount).sort(
    (a, b) => b[1] - a[1]
  );

  const topMood = Object.entries(moodCount).sort(
    (a, b) => b[1] - a[1]
  );

  const topGenre = Object.entries(genreCount).sort(
    (a, b) => b[1] - a[1]
  );

  // =============================
  // Listening Streak
  // =============================

  const uniqueDays = [
    ...new Set(
      data.map((item) =>
        new Date(item.played_at)
          .toISOString()
          .split("T")[0]
      )
    ),
  ].sort();

  let streak = 1;

  for (let i = uniqueDays.length - 1; i > 0; i--) {
    const current = new Date(uniqueDays[i]);
    const previous = new Date(uniqueDays[i - 1]);

    const diff =
      (current - previous) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return {
    minutes: Math.floor(totalMinutes / 60),

    totalSongs: data.length,

    topSong: topSong[0]?.[0] || "-",

    topArtist: topArtist[0]?.[0] || "-",

    favoriteMood: topMood[0]?.[0] || "-",

    favoriteGenre: topGenre[0]?.[0] || "-",

    streak,

    topSongs: topSong.slice(0, 10),

    topArtists: topArtist.slice(0, 5),
  };
};