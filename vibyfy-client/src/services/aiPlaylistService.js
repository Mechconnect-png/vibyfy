import { supabase } from "../lib/supabase";

export const generatePlaylist = async (type) => {
  let query = supabase.from("songs").select("*");

  switch (type) {
    case "happy":
      query = query.eq("mood", "happy");
      break;

    case "sad":
      query = query.eq("mood", "sad");
      break;

    case "workout":
      query = query.in("mood", [
        "energetic",
        "happy",
      ]);
      break;

    case "study":
      query = query.in("mood", [
        "calm",
        "neutral",
      ]);
      break;

    case "relax":
      query = query.in("mood", [
        "relief",
        "calm",
      ]);
      break;

    case "sleep":
      query = query.eq("mood", "calm");
      break;

    default:
      break;
  }

  const { data } = await query;

  return data || [];
};