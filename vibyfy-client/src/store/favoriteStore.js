import { create } from "zustand";

const useFavoriteStore = create((set) => ({
  favorites: [],

  setFavorites: (songs) =>
    set({
      favorites: songs,
    }),

  addFavorite: (song) =>
    set((state) => ({
      favorites: [...state.favorites, song],
    })),

  removeFavorite: (songId) =>
    set((state) => ({
      favorites: state.favorites.filter(
        (song) => song.id !== songId
      ),
    })),
}));

export default useFavoriteStore;