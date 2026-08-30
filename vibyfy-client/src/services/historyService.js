import { supabase } from "../lib/supabase";

// ==========================================
// GET CURRENT USER
// ==========================================
const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

// ==========================================
// SAVE RECENTLY PLAYED
// ==========================================
export const saveRecentlyPlayed = async (songId) => {
  try {
    const user = await getCurrentUser();

    if (!user) return;

    // Remove existing occurrence
    await supabase
      .from("recently_played")
      .delete()
      .eq("user_id", user.id)
      .eq("song_id", songId);

    // Insert latest play
    const { error } = await supabase
      .from("recently_played")
      .insert({
        user_id: user.id,
        song_id: songId,
      });

    if (error) throw error;

    // Keep only latest 20 songs
    const { data } = await supabase
      .from("recently_played")
      .select("id")
      .eq("user_id", user.id)
      .order("played_at", {
        ascending: false,
      });

    if (data && data.length > 20) {
      const removeIds = data
        .slice(20)
        .map((item) => item.id);

      await supabase
        .from("recently_played")
        .delete()
        .in("id", removeIds);
    }
  } catch (err) {
    console.error("Recently Played Error:", err);
  }
};

// ==========================================
// SAVE PLAY HISTORY
// ==========================================
export const savePlayHistory = async (songId) => {
  try {
    const user = await getCurrentUser();

    if (!user) return;

    const { error } = await supabase
      .from("play_history")
      .insert({
        user_id: user.id,
        song_id: songId,
      });

    if (error) throw error;
  } catch (err) {
    console.error("Play History Error:", err);
  }
};

// ==========================================
// GET RECENTLY PLAYED
// ==========================================
export const getRecentlyPlayed = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("recently_played")
      .select(
        `
        played_at,
        songs(*)
      `
      )
      .eq("user_id", user.id)
      .order("played_at", {
        ascending: false,
      });

    if (error) throw error;

    return data.map((item) => item.songs);
  } catch (err) {
    console.error("Get Recently Played Error:", err);
    return [];
  }
};

// ==========================================
// GET PLAY HISTORY
// ==========================================
export const getPlayHistory = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("play_history")
      .select(
        `
        played_at,
        songs(*)
      `
      )
      .eq("user_id", user.id)
      .order("played_at", {
        ascending: false,
      });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("History Fetch Error:", err);
    return [];
  }
};

// ==========================================
// CLEAR PLAY HISTORY
// ==========================================
export const clearPlayHistory = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) return;

    const { error } = await supabase
      .from("play_history")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
  } catch (err) {
    console.error("Clear History Error:", err);
  }
};

// ==========================================
// CLEAR RECENTLY PLAYED
// ==========================================
export const clearRecentlyPlayed = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) return;

    const { error } = await supabase
      .from("recently_played")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
  } catch (err) {
    console.error("Clear Recently Played Error:", err);
  }
};