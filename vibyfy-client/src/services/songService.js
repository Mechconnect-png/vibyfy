import { discoverByMood, searchMusic, getReliefMusicJourney } from "./musicDiscoveryService";

/**
 * Legacy compatibility wrapper redirecting song discovery to backend Spotify API
 */
export const getSongs = async () => {
  return discoverByMood("neutral");
};

export const getSongById = async (id) => {
  const songs = await discoverByMood("neutral");
  return songs.find((s) => s.id === id) || songs[0] || null;
};

export const getSongsByMood = async (targetMood) => {
  return discoverByMood(targetMood);
};

export const getSongsByRelief = async (reliefCategory) => {
  return getReliefMusicJourney("sad", reliefCategory || "calm");
};

export const getSongsByArtist = async (artist) => {
  return searchMusic(artist);
};

export const searchSongs = async (query) => {
  return searchMusic(query);
};