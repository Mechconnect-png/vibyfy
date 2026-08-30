export const getAnalyticsData = async () => {
  return {
    totalScans: 42,
    favoriteMood: "Happy",
    listeningTimeMinutes: 380,
  };
};

export const getTotalSongs = async () => 250;
export const getTotalUsers = async () => 128;
export const getTotalPlaylists = async () => 45;
export const getTotalFavorites = async () => 640;
export const getTotalPlays = async () => 3800;

export const getTopSongs = async () => [
  { id: "sp-h1", title: "Arabic Kuthu", plays: 850 },
  { id: "sp-h2", title: "Jimikki Ponnu", plays: 620 },
];

export const getTopArtists = async () => [
  { name: "Anirudh Ravichander", plays: 1420 },
  { name: "A. R. Rahman", plays: 980 },
];

export const getTopGenres = async () => [
  { genre: "Kuthu / Pop", percentage: 45 },
  { genre: "Melody", percentage: 35 },
];

export const getMoodAnalytics = async () => [
  { mood: "happy", count: 18 },
  { mood: "excited", count: 12 },
  { mood: "calm", count: 8 },
  { mood: "sad", count: 4 },
];

export default {
  getAnalyticsData,
  getTotalSongs,
  getTotalUsers,
  getTotalPlaylists,
  getTotalFavorites,
  getTotalPlays,
  getTopSongs,
  getTopArtists,
  getTopGenres,
  getMoodAnalytics,
};