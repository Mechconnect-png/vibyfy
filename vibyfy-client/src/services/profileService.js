import { supabase } from "../lib/supabase";

/**
 * Ensures a row exists in `profiles` for the given auth user.
 * Safe to call even if a DB trigger already creates profiles on
 * signup — uses upsert so it's a no-op if the row already exists.
 * Errors are logged but never thrown, so this never blocks signup/login.
 */
export const ensureProfile = async (user, extra = {}) => {
    if (!user?.id) return;

    try {
        await supabase.from("profiles").upsert(
            {
                id: user.id,
                email: user.email,
                name: extra.name || user.user_metadata?.full_name || "",
                role: "user",
                ...extra,
            },
            { onConflict: "id", ignoreDuplicates: true }
        );
    } catch (err) {
        console.error("ensureProfile: failed to upsert profile", err);
    }
};

export const getProfile = async () => {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const { data: stats } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

    return {

        ...profile,

        songsPlayed: stats?.songs_played || 0,

        minutes: stats?.minutes_listened || 0,

        favorites: stats?.favorites || 0,

        playlists: stats?.playlists || 0,

        followers: stats?.followers || 0,

        following: stats?.following || 0,

    };

};

export const updateProfile = async (values) => {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return await supabase
        .from("profiles")
        .update(values)
        .eq("id", user.id);

};