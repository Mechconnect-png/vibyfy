import { supabase } from "../lib/supabase";

// Get all favorite songs
export const getFavorites = async () => {
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      song_id,
      songs (*)
    `);

  if (error) throw error;

  return data.map((item) => ({
    ...item.songs,
    audio: item.songs.audio_url,
  }));
};

// Add favorite
export const addFavorite = async (songId) => {
  const { error } = await supabase
    .from("favorites")
    .insert({
      song_id: songId,
    });

  if (error) throw error;
};

// Remove favorite
export const removeFavorite = async (songId) => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("song_id", songId);

  if (error) throw error;
};

// Check favorite
export const isFavorite = async (songId) => {
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("song_id", songId)
    .maybeSingle();

  return !!data;
};