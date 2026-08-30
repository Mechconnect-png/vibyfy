const LOCAL_PLAYLISTS_KEY = "vibyfy_local_playlists";
const LOCAL_PLAYLIST_SONGS_KEY = "vibyfy_local_playlist_songs";

const getLocalPlaylists = () => {
  try {
    const raw = localStorage.getItem(LOCAL_PLAYLISTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {}
  return [
    { id: "pl-1", name: "Tamil Chill Hits", description: "Soft acoustic and melody tracks", created_at: new Date().toISOString() },
    { id: "pl-2", name: "Kuthu Energy Boost", description: "Fast beat dance tracks", created_at: new Date().toISOString() },
  ];
};

const setLocalPlaylists = (pls) => {
  try {
    localStorage.setItem(LOCAL_PLAYLISTS_KEY, JSON.stringify(pls));
  } catch (err) {}
};

const getLocalPlaylistSongs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_PLAYLIST_SONGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {}
  return [
    { playlistId: "pl-1", songId: "sp-h1" },
    { playlistId: "pl-1", songId: "sp-c1" },
    { playlistId: "pl-2", songId: "sp-h4" },
    { playlistId: "pl-2", songId: "sp-e1" },
  ];
};

const setLocalPlaylistSongs = (items) => {
  try {
    localStorage.setItem(LOCAL_PLAYLIST_SONGS_KEY, JSON.stringify(items));
  } catch (err) {}
};

export const getPlaylists = async () => {
  return getLocalPlaylists();
};

export const getPlaylist = async (playlistId) => {
  const pls = getLocalPlaylists();
  return pls.find((p) => p.id === playlistId) || pls[0] || null;
};

export const getPlaylistSongs = async (playlistId) => {
  const { discoverByMood } = await import("./musicDiscoveryService");
  const discovery = await discoverByMood("happy");
  const allSongs = discovery.songs || [];
  const psItems = getLocalPlaylistSongs();
  const matchingSongIds = psItems.filter((item) => item.playlistId === playlistId).map((item) => item.songId);
  const matched = allSongs.filter((s) => matchingSongIds.includes(s.spotifyId || s.id));
  return matched.length > 0 ? matched : allSongs.slice(0, 4);
};

export const createPlaylist = async (name, description = "") => {
  const newPl = {
    id: `pl-${Date.now()}`,
    name,
    description,
    created_at: new Date().toISOString(),
  };

  const pls = getLocalPlaylists();
  setLocalPlaylists([newPl, ...pls]);
  return newPl;
};

export const deletePlaylist = async (id) => {
  const pls = getLocalPlaylists();
  setLocalPlaylists(pls.filter((p) => p.id !== id));
};

export const renamePlaylist = async (id, name, description) => {
  const pls = getLocalPlaylists();
  setLocalPlaylists(pls.map((p) => (p.id === id ? { ...p, name, description } : p)));
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const items = getLocalPlaylistSongs();
  if (!items.some((i) => i.playlistId === playlistId && i.songId === songId)) {
    setLocalPlaylistSongs([...items, { playlistId, songId }]);
  }
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  const items = getLocalPlaylistSongs();
  setLocalPlaylistSongs(items.filter((i) => !(i.playlistId === playlistId && i.songId === songId)));
};

export const isSongInPlaylist = async (playlistId, songId) => {
  const items = getLocalPlaylistSongs();
  return items.some((i) => i.playlistId === playlistId && i.songId === songId);
};