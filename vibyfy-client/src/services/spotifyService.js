// VIBYFY Spotify Direct Link & Identity Validation Service

/**
 * Formats or validates direct web URL for a track
 */
export const getSpotifyWebUrl = (song) => {
  if (!song) return null;
  
  if (song.externalUrl && song.externalUrl.startsWith("http")) {
    return song.externalUrl;
  }

  const trackId = song.spotifyId || song.id;
  if (trackId && !trackId.startsWith("vibyfy") && !trackId.startsWith("demo")) {
    return `https://open.spotify.com/track/${trackId}`;
  }

  // Exact title + artist search intent fallback if ID unavailable
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  return `https://open.spotify.com/search/${query}`;
};

/**
 * Validate track identity before performing external open action
 */
export const validateTrackIdentity = (song) => {
  if (!song) return { valid: false, reason: "Song object is null or undefined" };
  const spotifyId = song.spotifyId || song.id;
  const externalUrl = song.externalUrl || getSpotifyWebUrl(song);

  if (!spotifyId) {
    return { valid: false, reason: "Missing spotifyId / id" };
  }
  if (!song.title) {
    return { valid: false, reason: "Missing song title" };
  }
  if (!externalUrl) {
    return { valid: false, reason: "Missing externalUrl" };
  }

  return { valid: true, spotifyId, externalUrl };
};

/**
 * Open EXACT selected track in Spotify
 * Step 5 & Step 15: Single Action Click Flow & Debugging
 */
export const openInSpotify = (song) => {
  if (!song) {
    console.error("❌ Cannot open in Spotify: song object is undefined");
    return;
  }

  const validation = validateTrackIdentity(song);
  if (!validation.valid) {
    console.warn(`⚠️ Invalid Spotify Track Identity (${validation.reason}):`, song);
    return;
  }

  const trackId = song.spotifyId || song.id;
  const targetUrl = song.externalUrl || getSpotifyWebUrl(song);

  // Step 15: Exact Track Click Debugging
  console.log("👉 CLICKED TRACK:", {
    spotifyId: trackId,
    title: song.title,
    artist: song.artist,
    externalUrl: targetUrl,
  });

  console.log("🚀 OPENING TRACK:", {
    spotifyId: trackId,
    title: song.title,
    artist: song.artist,
    externalUrl: targetUrl,
  });

  window.open(targetUrl, "_blank", "noopener,noreferrer");
};
