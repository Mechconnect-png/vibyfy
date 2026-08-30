const LOCAL_FOLLOWS_KEY = "vibyfy_followed_artists";

const getLocalFollows = () => {
  try {
    const raw = localStorage.getItem(LOCAL_FOLLOWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const setLocalFollows = (list) => {
  localStorage.setItem(LOCAL_FOLLOWS_KEY, JSON.stringify(list));
};

export const followArtist = async (artistId) => {
  const follows = getLocalFollows();
  if (!follows.includes(artistId)) {
    setLocalFollows([...follows, artistId]);
  }
};

export const unfollowArtist = async (artistId) => {
  const follows = getLocalFollows();
  setLocalFollows(follows.filter((id) => id !== artistId));
};

export const isFollowingArtist = async (artistId) => {
  const follows = getLocalFollows();
  return follows.includes(artistId);
};

export const isFollowing = async (artistId) => {
  return isFollowingArtist(artistId);
};

export const getFollowersCount = async (artistId) => {
  return 12500;
};

export const getFollowedArtists = async () => {
  return getLocalFollows();
};

export default {
  followArtist,
  unfollowArtist,
  isFollowingArtist,
  isFollowing,
  getFollowersCount,
  getFollowedArtists,
};