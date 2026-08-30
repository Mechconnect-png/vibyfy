import { supabase } from "../lib/supabase";

// ======================================
// Get Current User
// ======================================
const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

// ======================================
// Follow Artist
// ======================================
export const followArtist = async (artistId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not logged in");

  const { error } = await supabase
    .from("artist_followers")
    .insert({
      artist_id: artistId,
      follower_id: user.id,
    });

  if (error) throw error;
};

// ======================================
// Unfollow Artist
// ======================================
export const unfollowArtist = async (artistId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not logged in");

  const { error } = await supabase
    .from("artist_followers")
    .delete()
    .eq("artist_id", artistId)
    .eq("follower_id", user.id);

  if (error) throw error;
};

// ======================================
// Check Following
// ======================================
export const isFollowing = async (artistId) => {
  const user = await getCurrentUser();

  if (!user) return false;

  const { data } = await supabase
    .from("artist_followers")
    .select("id")
    .eq("artist_id", artistId)
    .eq("follower_id", user.id)
    .maybeSingle();

  return !!data;
};

// ======================================
// Followers Count
// ======================================
export const getFollowersCount = async (artistId) => {
  const { count, error } = await supabase
    .from("artist_followers")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("artist_id", artistId);

  if (error) throw error;

  return count || 0;
};

// ======================================
// Get Following Artists
// ======================================
export const getFollowingArtists = async () => {
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("artist_followers")
    .select(`
      artist_id,
      profiles (
        id,
        full_name,
        avatar_url,
        role
      )
    `)
    .eq("follower_id", user.id);

  if (error) throw error;

  return data;
};

// ======================================
// Get Artist Followers
// ======================================
export const getArtistFollowers = async (artistId) => {
  const { data, error } = await supabase
    .from("artist_followers")
    .select(`
      follower_id,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("artist_id", artistId);

  if (error) throw error;

  return data;
};

// ======================================
// Remove All Followers (Admin)
// ======================================
export const removeAllFollowers = async (artistId) => {
  const { error } = await supabase
    .from("artist_followers")
    .delete()
    .eq("artist_id", artistId);

  if (error) throw error;
};