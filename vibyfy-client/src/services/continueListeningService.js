import { supabase } from "../lib/supabase";

export const getContinueListening = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("recently_played")
    .select(`
      *,
      songs(*)
    `)
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};