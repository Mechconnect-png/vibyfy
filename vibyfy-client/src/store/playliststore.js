import { create } from "zustand";

const usePlaylistStore = create((set) => ({
  playlists: [],

  setPlaylists: (playlists) =>
    set({ playlists }),

  addPlaylist: (playlist) =>
    set((state) => ({
      playlists: [playlist, ...state.playlists],
    })),

  removePlaylist: (id) =>
    set((state) => ({
      playlists: state.playlists.filter(
        (p) => p.id !== id
      ),
    })),
}));

export default usePlaylistStore;