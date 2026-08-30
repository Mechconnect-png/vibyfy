import { create } from "zustand";
import { openSpotifyTrack } from "../services/spotifyPlaybackService";
import useQueueStore from "./queueStore";

export const audio = new Audio();

const usePlayerStore = create((set, get) => ({
  playlist: [],
  currentSong: null,
  currentTrackId: null,
  currentIndex: -1,
  isPlaying: false,

  playSong: (song, playlist = []) => {
    if (!song) return;

    const trackId = song.spotifyId || song.id;
    console.log("🎵 PLAYER STORE: Setting Current Song ->", {
      spotifyId: trackId,
      spotifyUri: song.spotifyUri,
      title: song.title,
      artist: song.artist,
      externalUrl: song.externalUrl,
    });

    const activeList = playlist.length > 0 ? playlist : get().playlist;
    const index = activeList.findIndex((s) => (s.spotifyId || s.id) === trackId);

    set({
      currentSong: song,
      currentTrackId: trackId,
      playlist: activeList,
      currentIndex: index >= 0 ? index : 0,
      isPlaying: true,
    });

    useQueueStore.getState().setQueue(activeList);
    if (index >= 0) {
      useQueueStore.getState().setCurrentIndex(index);
    }
  },

  pauseSong: () => set({ isPlaying: false }),

  togglePlay: () => {
    const { currentSong } = get();
    if (currentSong) {
      openSpotifyTrack(currentSong);
    }
  },

  nextSong: () => {
    const { playlist, currentIndex } = get();
    if (!playlist.length) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      get().playSong(nextTrack, playlist);
      openSpotifyTrack(nextTrack);
    }
  },

  previousSong: () => {
    const { playlist, currentIndex } = get();
    if (!playlist.length) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      get().playSong(prevTrack, playlist);
      openSpotifyTrack(prevTrack);
    }
  },

  setPlaylist: (songs = []) => set({ playlist: songs }),
}));

export default usePlayerStore;