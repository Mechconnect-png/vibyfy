import { create } from "zustand";

const useQueueStore = create((set, get) => ({
  // ==========================
  // STATE
  // ==========================
  queue: [],
  currentIndex: 0,

  // ==========================
  // REPLACE QUEUE
  // ==========================
  setQueue: (songs = []) => {
    set({
      queue: [...songs],
      currentIndex: 0,
    });
  },

  // ==========================
  // UPDATE CURRENT INDEX
  // ==========================
  setCurrentIndex: (index) => {
    set({
      currentIndex: index,
    });
  },

  // ==========================
  // ADD TO END OF QUEUE
  // ==========================
  addToQueue: (song) => {
    if (!song) return;

    const exists = get().queue.some(
      (item) => item.id === song.id
    );

    if (exists) return;

    set((state) => ({
      queue: [...state.queue, song],
    }));
  },

  // ==========================
  // PLAY NEXT
  // Insert after current song
  // ==========================
  playNext: (song) => {
    if (!song) return;

    const { queue, currentIndex } = get();

    const updated = queue.filter(
      (item) => item.id !== song.id
    );

    updated.splice(currentIndex + 1, 0, song);

    set({
      queue: updated,
    });
  },

  // ==========================
  // REMOVE SONG
  // ==========================
  removeFromQueue: (songId) => {
    set((state) => ({
      queue: state.queue.filter(
        (song) => song.id !== songId
      ),
    }));
  },

  // ==========================
  // MOVE SONG
  // Drag & Drop Support
  // ==========================
  moveSong: (from, to) => {
    const queue = [...get().queue];

    if (
      from < 0 ||
      to < 0 ||
      from >= queue.length ||
      to >= queue.length
    ) {
      return;
    }

    const [moved] = queue.splice(from, 1);

    queue.splice(to, 0, moved);

    set({
      queue,
    });
  },

  // ==========================
  // CLEAR QUEUE
  // ==========================
  clearQueue: () => {
    set({
      queue: [],
      currentIndex: 0,
    });
  },

  // ==========================
  // GET CURRENT SONG
  // ==========================
  getCurrentSong: () => {
    const { queue, currentIndex } = get();

    return queue[currentIndex] || null;
  },

  // ==========================
  // GET NEXT SONG
  // ==========================
  getNextSong: () => {
    const { queue, currentIndex } = get();

    if (currentIndex >= queue.length - 1) {
      return null;
    }

    return queue[currentIndex + 1];
  },

  // ==========================
  // GET PREVIOUS SONG
  // ==========================
  getPreviousSong: () => {
    const { queue, currentIndex } = get();

    if (currentIndex <= 0) {
      return null;
    }

    return queue[currentIndex - 1];
  },

  // ==========================
  // CHECK IF SONG EXISTS
  // ==========================
  isQueued: (songId) => {
    return get().queue.some(
      (song) => song.id === songId
    );
  },
}));

export default useQueueStore;