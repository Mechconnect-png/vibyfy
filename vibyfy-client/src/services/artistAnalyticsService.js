import { supabase } from "../lib/supabase";

export const getArtistStats = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Total Songs
  const { count: totalSongs } = await supabase
    .from("songs")
    .select("*", { count: "exact", head: true })
    .eq("artist_id", user.id);

  // Total Plays
  const { data: songs } = await supabase
    .from("songs")
    .select("id")
    .eq("artist_id", user.id);

  const ids = songs?.map((s) => s.id) || [];

  let totalPlays = 0;

  if (ids.length) {
    const { count } = await supabase
      .from("song_plays")
      .select("*", {
        count: "exact",
        head: true,
      })
      .in("song_id", ids);

    totalPlays = count || 0;
  }

  return {
    totalSongs,
    totalPlays,
  };
};