import { supabase } from "../lib/supabase";

// Get artist details
export const getArtist = async (id) => {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

// Get all songs by artist
export const getArtistSongs = async (artistName) => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("artist", artistName)
    .order("title");

  if (error) throw error;

  return data;
};