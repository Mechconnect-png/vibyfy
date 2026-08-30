export const uploadSong = async ({ title, artist, mood, coverFile, audioFile }) => {
  return {
    id: `upload-${Date.now()}`,
    title,
    artist,
    mood,
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop",
    audio: "",
  };
};