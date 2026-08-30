import { supabase } from "../lib/supabase";

// ============================================
// TOTAL SONGS
// ============================================

export const getTotalSongs = async () => {
  const { count, error } = await supabase
    .from("songs")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) return 0;

  return count || 0;
};

// ============================================
// TOTAL USERS
// ============================================

export const getTotalUsers = async () => {
  const { count, error } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) return 0;

  return count || 0;
};

// ============================================
// TOTAL PLAYLISTS
// ============================================

export const getTotalPlaylists = async () => {
  const { count, error } = await supabase
    .from("playlists")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) return 0;

  return count || 0;
};

// ============================================
// TOTAL PLAYS
// ============================================

export const getTotalPlays = async () => {
  const { count, error } = await supabase
    .from("play_history")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) return 0;

  return count || 0;
};

// ============================================
// TOTAL FAVORITES
// ============================================

export const getTotalFavorites = async () => {
  const { count, error } = await supabase
    .from("favorites")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) return 0;

  return count || 0;
};

// ============================================
// TOP SONGS
// ============================================

export const getTopSongs = async () => {
  const { data, error } = await supabase
    .from("play_history")
    .select(`
      song_id,
      songs(
        id,
        title,
        artist,
        cover
      )
    `);

  if (error || !data) return [];

  const map = {};

  data.forEach((item) => {
    const song = item.songs;

    if (!song) return;

    if (!map[song.id]) {
      map[song.id] = {
        ...song,
        plays: 0,
      };
    }

    map[song.id].plays++;
  });

  return Object.values(map)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10);
};

// ============================================
// TOP ARTISTS
// ============================================

export const getTopArtists = async () => {
  const { data, error } = await supabase
    .from("play_history")
    .select(`
      songs(
        artist
      )
    `);

  if (error || !data) return [];

  const map = {};

  data.forEach((item) => {
    const artist = item.songs?.artist;

    if (!artist) return;

    map[artist] = (map[artist] || 0) + 1;
  });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([artist, plays]) => ({
      artist,
      plays,
    }));
};

// ============================================
// TOP GENRES
// ============================================

export const getTopGenres = async () => {
  const { data, error } = await supabase
    .from("play_history")
    .select(`
      songs(
        genre
      )
    `);

  if (error || !data) return [];

  const map = {};

  data.forEach((item) => {
    const genre = item.songs?.genre;

    if (!genre) return;

    map[genre] = (map[genre] || 0) + 1;
  });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, plays]) => ({
      genre,
      plays,
    }));
};

// ============================================
// MOOD ANALYTICS
// ============================================

export const getMoodAnalytics = async () => {
  const { data, error } = await supabase
    .from("play_history")
    .select(`
      songs(
        mood
      )
    `);

  if (error || !data) return [];

  const map = {};

  data.forEach((item) => {
    const mood = item.songs?.mood;

    if (!mood) return;

    map[mood] = (map[mood] || 0) + 1;
  });

  return Object.entries(map).map(([mood, count]) => ({
    mood,
    count,
  }));
};

export const getTrendingSongs = async () => {
  const { data, error } = await supabase
    .from("play_history")
    .select(`
      song_id,
      songs(*)
    `);

  if (error) {
    console.error(error);
    return [];
  }

  // Count plays
  const playMap = {};

  data.forEach((item) => {
    if (!item.songs) return;

    const id = item.song_id;

    if (!playMap[id]) {
      playMap[id] = {
        ...item.songs,
        plays: 0,
      };
    }

    playMap[id].plays++;
  });

  return Object.values(playMap)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 12);
};