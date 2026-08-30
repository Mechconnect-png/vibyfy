import { supabase } from "../lib/supabase";

const LOCAL_PLAYLISTS_KEY = "moodify_local_playlists";
const LOCAL_PLAYLIST_SONGS_KEY = "moodify_local_playlist_songs";

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
    { playlistId: "pl-1", songId: "song-4" },
    { playlistId: "pl-1", songId: "song-7" },
    { playlistId: "pl-2", songId: "song-1" },
    { playlistId: "pl-2", songId: "song-2" },
  ];
};

const setLocalPlaylistSongs = (items) => {
  try {
    localStorage.setItem(LOCAL_PLAYLIST_SONGS_KEY, JSON.stringify(items));
  } catch (err) {}
};

// Get all playlists
export const getPlaylists = async () => {
  try {
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) return data;
  } catch (err) {}

  return getLocalPlaylists();
};

// Get one playlist
export const getPlaylist = async (playlistId) => {
  try {
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("id", playlistId)
      .single();

    if (!error && data) return data;
  } catch (err) {}

  const pls = getLocalPlaylists();
  return pls.find((p) => p.id === playlistId) || pls[0] || null;
};

// Get songs in playlist
export const getPlaylistSongs = async (playlistId) => {
  try {
    const { data, error } = await supabase
      .from("playlist_songs")
      .select(`song_id, songs (*)`)
      .eq("playlist_id", playlistId);

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        ...item.songs,
        audio: item.songs.audio_url || item.songs.audio,
      }));
    }
  } catch (err) {}

  const { getSongs } = await import("./songService");
  const allSongs = await getSongs();
  const psItems = getLocalPlaylistSongs();
  const matchingSongIds = psItems.filter((item) => item.playlistId === playlistId).map((item) => item.songId);
  return allSongs.filter((s) => matchingSongIds.includes(s.id));
};

// Create playlist
export const createPlaylist = async (name, description = "") => {
  const newPl = {
    id: `pl-${Date.now()}`,
    name,
    description,
    created_at: new Date().toISOString(),
  };

  const pls = getLocalPlaylists();
  setLocalPlaylists([newPl, ...pls]);

  try {
    const { data, error } = await supabase
      .from("playlists")
      .insert({ name, description })
      .select()
      .single();

    if (!error && data) return data;
  } catch (err) {}

  return newPl;
};

// Delete playlist
export const deletePlaylist = async (id) => {
  const pls = getLocalPlaylists();
  setLocalPlaylists(pls.filter((p) => p.id !== id));

  try {
    await supabase.from("playlists").delete().eq("id", id);
  } catch (err) {}
};

// Rename playlist
export const renamePlaylist = async (id, name, description) => {
  const pls = getLocalPlaylists();
  setLocalPlaylists(pls.map((p) => (p.id === id ? { ...p, name, description } : p)));

  try {
    await supabase.from("playlists").update({ name, description }).eq("id", id);
  } catch (err) {}
};

// Add song
export const addSongToPlaylist = async (playlistId, songId) => {
  const items = getLocalPlaylistSongs();
  if (!items.some((i) => i.playlistId === playlistId && i.songId === songId)) {
    setLocalPlaylistSongs([...items, { playlistId, songId }]);
  }

  try {
    await supabase.from("playlist_songs").insert({ playlist_id: playlistId, song_id: songId });
  } catch (err) {}
};

// Remove song
export const removeSongFromPlaylist = async (playlistId, songId) => {
  const items = getLocalPlaylistSongs();
  setLocalPlaylistSongs(items.filter((i) => !(i.playlistId === playlistId && i.songId === songId)));

  try {
    await supabase.from("playlist_songs").delete().eq("playlist_id", playlistId).eq("song_id", songId);
  } catch (err) {}
};

// Check if song exists
export const isSongInPlaylist = async (playlistId, songId) => {
  const items = getLocalPlaylistSongs();
  if (items.some((i) => i.playlistId === playlistId && i.songId === songId)) return true;

  try {
    const { data } = await supabase
      .from("playlist_songs")
      .select("id")
      .eq("playlist_id", playlistId)
      .eq("song_id", songId)
      .maybeSingle();

    return !!data;
  } catch (err) {}

  return false;
};