export const getLyrics = async (songTitle, artistName) => {
  return {
    title: songTitle || "Track Lyrics",
    artist: artistName || "Artist",
    lyrics: `[Verse 1]\nFeel the vibe, let the music flow\nEvery rhythm starts to grow\n\n[Chorus]\nVIBYFY taking you higher\nMusic burning like a fire\n\n[Outro]\nFind your sound.`,
  };
};