import { discoverByMood } from "./musicDiscoveryService";

export const getArtistProfile = async (id) => {
  return {
    id: id || "artist-1",
    name: "Anirudh Ravichander",
    genre: "Tamil Pop & Kuthu",
    followers: 1250000,
    bio: "Indian music composer and singer.",
  };
};

export const getArtist = async (id) => {
  return getArtistProfile(id);
};

export const getArtistSongs = async (id) => {
  const res = await discoverByMood("happy", 10);
  return res.songs || [];
};

export default {
  getArtistProfile,
  getArtist,
  getArtistSongs,
};