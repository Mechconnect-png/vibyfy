import { supabase } from "../lib/supabase";

const LOCAL_STORAGE_KEY = "moodify_favorite_song_ids";

const getLocalFavorites = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

const setLocalFavorites = (ids) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error("LocalStorage save error:", err);
  }
};

// ===========================
// LIKE SONG
// ===========================
export const likeSong = async (songId) => {
  if (!songId) return;

  // Local fallback state first
  const localIds = getLocalFavorites();
  if (!localIds.includes(songId)) {
    setLocalFavorites([...localIds, songId]);
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .maybeSingle();

      if (!existing) {
        await supabase.from("favorites").insert({
          user_id: user.id,
          song_id: songId,
        });
      }
    }
  } catch (err) {
    console.warn("Supabase favorite insert warning (using local sync):", err.message || err);
  }

  return true;
};

// ===========================
// UNLIKE SONG
// ===========================
export const unlikeSong = async (songId) => {
  if (!songId) return;

  const localIds = getLocalFavorites();
  setLocalFavorites(localIds.filter((id) => id !== songId));

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);
    }
  } catch (err) {
    console.warn("Supabase favorite delete warning (using local sync):", err.message || err);
  }

  return true;
};

// ===========================
// CHECK IF LIKED
// ===========================
export const isLiked = async (songId) => {
  if (!songId) return false;

  const localIds = getLocalFavorites();
  if (localIds.includes(songId)) return true;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .maybeSingle();

      return !!data;
    }
  } catch (err) {
    // Return local check
  }

  return false;
};

// ===========================
// GET ALL LIKED SONGS
// ===========================
export const getLikedSongs = async () => {
  const localIds = getLocalFavorites();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("favorites")
        .select(`song_id, songs (*)`)
        .eq("user_id", user.id);

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          ...item.songs,
          audio: item.songs.audio_url || item.songs.audio,
        }));
      }
    }
  } catch (err) {
    console.warn("Supabase favorites fetch warning, falling back to local dataset:", err.message || err);
  }

  // Fallback using local song dataset and localIds
  const { getSongs } = await import("./songService");
  const allSongs = await getSongs();
  return allSongs.filter((s) => localIds.includes(s.id));
};