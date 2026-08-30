export const getArtistAnalytics = async () => {
  return {
    totalStreams: 12500,
    monthlyListeners: 3400,
    topTrack: "Tamil Chill Hits",
  };
};

export const getArtistStats = async (artistId) => {
  return {
    totalStreams: 12500,
    monthlyListeners: 3400,
    topTrack: "Tamil Chill Hits",
    followers: 1420,
  };
};

export default {
  getArtistAnalytics,
  getArtistStats,
};