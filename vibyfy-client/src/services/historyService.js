const LOCAL_HISTORY_KEY = "vibyfy_listening_history";

const getLocalHistory = () => {
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const setLocalHistory = (list) => {
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) {}
};

export const addSongToHistory = async (song) => {
  if (!song) return;
  const history = getLocalHistory();
  const trackId = song.spotifyId || song.id;
  const filtered = history.filter((item) => (item.spotifyId || item.id) !== trackId);
  setLocalHistory([{ ...song, listenedAt: new Date().toISOString() }, ...filtered]);
};

export const getListeningHistory = async () => {
  return getLocalHistory();
};

export const getRecentlyPlayed = async (limit = 10) => {
  const history = getLocalHistory();
  return history.slice(0, limit);
};

export const clearHistory = async () => {
  localStorage.removeItem(LOCAL_HISTORY_KEY);
};