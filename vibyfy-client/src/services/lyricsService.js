import { supabase } from "../lib/supabase";

export const getLyrics = async (songId) => {
  const { data, error } = await supabase
    .from("lyrics")
    .select("lyrics")
    .eq("song_id", songId)
    .maybeSingle();

  if (error) throw error;

  return data?.lyrics || "";
};

export const saveLyrics = async (
  songId,
  lyrics
) => {
  const { error } = await supabase
    .from("lyrics")
    .upsert({
      song_id: songId,
      lyrics,
    });

  if (error) throw error;
};