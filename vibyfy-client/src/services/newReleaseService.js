import { supabase } from "../lib/supabase";

export const getNewReleases = async () => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
};