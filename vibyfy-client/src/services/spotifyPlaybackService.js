import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000/api/spotify";

/**
 * Validate track identity before attempting playback
 */
export const validateTrack = (track) => {
  if (!track) return { valid: false, reason: "Track object is null or undefined" };

  const spotifyId = track.spotifyId || track.id;
  if (!spotifyId) {
    return { valid: false, reason: "Missing spotifyId / track ID" };
  }

  const spotifyUri = track.spotifyUri || (spotifyId.startsWith("spotify:") ? spotifyId : `spotify:track:${spotifyId}`);
  const externalUrl = track.externalUrl || (spotifyId.startsWith("sp-") ? `https://open.spotify.com/search/${encodeURIComponent(track.title + " " + track.artist)}` : `https://open.spotify.com/track/${spotifyId}`);

  return {
    valid: true,
    spotifyId,
    spotifyUri,
    externalUrl,
    title: track.title || "Untitled Track",
    artist: track.artist || "Unknown Artist",
  };
};

/**
 * Graceful Fallback: Open exact track URL in Spotify
 */
export const fallbackToSpotifyTrack = (track) => {
  const v = validateTrack(track);
  if (!v.valid) {
    toast.error(`Cannot open track: ${v.reason}`);
    return;
  }

  console.log("🔗 FALLBACK: Opening exact Spotify track URL:", v.externalUrl);
  toast.loading(`Opening "${v.title}" in Spotify...`, { duration: 2500, icon: "🎵" });
  window.open(v.externalUrl, "_blank", "noopener,noreferrer");
};

/**
 * Priority 1 & 2 Playback Strategy Engine
 */
export const attemptSpotifyPlayback = async (track, userAccessToken = null) => {
  const v = validateTrack(track);
  if (!v.valid) {
    console.warn("⚠️ Cannot play invalid track:", v.reason);
    return { success: false, reason: v.reason };
  }

  console.log("👉 STEP 24 DEBUG — PLAYBACK ATTEMPT:", {
    clickedTrackId: v.spotifyId,
    clickedTrackUri: v.spotifyUri,
    openedUrl: v.externalUrl,
  });

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // PRIORITY 1: Mobile Deep Link Strategy
  if (isMobile) {
    try {
      console.log("📱 Priority 1: Triggering Mobile App Deep Link:", v.spotifyUri);
      toast.loading(`Launching Spotify App for "${v.title}"...`, { duration: 3000, icon: "📱" });
      window.location.href = v.spotifyUri;

      // Fallback timer if app fails to launch
      setTimeout(() => {
        if (document.hidden) return;
        console.log("📱 Mobile app deep link fallback to web URL");
        window.open(v.externalUrl, "_blank", "noopener,noreferrer");
      }, 2000);

      return { success: true, mode: "deep-link" };
    } catch (e) {
      console.warn("Mobile deep link error:", e);
    }
  }

  // PRIORITY 2: Authorized Spotify Web API Playback
  if (userAccessToken || localStorage.getItem("vibyfy_spotify_user_token")) {
    const token = userAccessToken || localStorage.getItem("vibyfy_spotify_user_token");
    try {
      toast.loading(`Sending playback command to Spotify for "${v.title}"...`, { id: "sp-play" });

      const res = await axios.post(`${API_BASE_URL}/play`, {
        spotifyUri: v.spotifyUri,
        userAccessToken: token,
      });

      if (res.data && res.data.playbackStarted) {
        toast.success(`▶️ Now Playing on Spotify: "${v.title}"`, { id: "sp-play" });
        return { success: true, mode: "web-api", spotifyUri: v.spotifyUri };
      }
    } catch (err) {
      const code = err?.response?.data?.code;
      const errorMsg = err?.response?.data?.error || "Playback control unavailable";
      console.warn("Spotify Playback API error:", code, errorMsg);

      if (code === "NO_ACTIVE_DEVICE") {
        toast.error("No active Spotify app found. Open Spotify once and try again!", { id: "sp-play", duration: 5000 });
      } else if (code === "PREMIUM_REQUIRED") {
        toast.error("Spotify Premium is required for direct Web API playback control.", { id: "sp-play", duration: 5000 });
      } else {
        toast.dismiss("sp-play");
      }
    }
  }

  // PRIORITY 3: Fallback to exact Spotify Track URL
  fallbackToSpotifyTrack(track);
  return { success: true, mode: "fallback-url" };
};

/**
 * Centralized Single Entry Point for Opening Spotify Tracks
 */
export const openSpotifyTrack = (track, userAccessToken = null) => {
  return attemptSpotifyPlayback(track, userAccessToken);
};

export default {
  validateTrack,
  attemptSpotifyPlayback,
  fallbackToSpotifyTrack,
  openSpotifyTrack,
};
