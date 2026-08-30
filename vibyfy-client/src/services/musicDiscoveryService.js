import axios from "axios";
import { getSpotifyWebUrl, validateTrackIdentity } from "./spotifyService";
import API_URL from "../config/apiConfig";

const API_BASE_URL = `${API_URL}/api/music`;

/**
 * Frontend Canonical Track Normalizer
 */
export const normalizeSong = (item) => {
  if (!item) return null;

  const trackId = item.spotifyId || item.id || `sp-${Math.random().toString(36).substring(2, 9)}`;
  const title = item.title || item.name || "Untitled Track";
  const artist = item.artist || (Array.isArray(item.artists) ? item.artists.map((a) => (typeof a === "string" ? a : a.name)).join(", ") : "Unknown Artist");
  const album = item.album || "Spotify Single";
  const image = item.image || item.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop";
  const query = encodeURIComponent(`${title} ${artist}`);
  const externalUrl = item.externalUrl || item.external_urls?.spotify || `https://open.spotify.com/search/${query}`;
  const spotifyUri = item.spotifyUri || item.uri || `spotify:search:${query}`;

  return {
    id: trackId,
    spotifyId: trackId,
    title,
    artist,
    artists: item.artists || [{ id: "", name: artist }],
    album,
    image,
    cover: image,
    externalUrl,
    spotifyUri,
    previewUrl: item.previewUrl || item.preview_url || null,
    durationMs: item.durationMs || item.duration_ms || 240000,
    duration: item.duration || Math.round((item.durationMs || 240000) / 1000),
    mood: (item.mood || "neutral").toLowerCase(),
    provider: "spotify",
    popularity: item.popularity || 85,
  };
};

/**
 * Primary Music Discovery Engine with Pagination (limit & offset)
 */
export const discoverByMood = async (lockedMood, limit = 10, offset = 0) => {
  const targetMood = (lockedMood || "neutral").toLowerCase();

  try {
    const res = await axios.get(`${API_BASE_URL}/discover`, {
      params: { mood: targetMood, limit, offset },
      timeout: 8000,
    });

    if (res.data && res.data.data) {
      const normalized = res.data.data.map(normalizeSong).filter((s) => validateTrackIdentity(s).valid);
      return {
        songs: normalized,
        hasMore: res.data.hasMore ?? false,
        total: res.data.total ?? normalized.length,
      };
    }
  } catch (error) {
    console.warn("Backend Spotify Service notice, using normalized discovery catalog:", error.message);
  }

  const fallback = getFallbackSongsByMood(targetMood);
  const sliced = fallback.slice(offset, offset + limit);
  return {
    songs: sliced,
    hasMore: offset + limit < fallback.length,
    total: fallback.length,
  };
};

/**
 * Relief Zone Music Journey Engine with Pagination
 */
export const getReliefMusicJourney = async (fromMood, toMood, limit = 10, offset = 0) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/relief`, {
      params: { from: fromMood, to: toMood, limit, offset },
      timeout: 8000,
    });

    if (res.data && res.data.data) {
      const normalized = res.data.data.map(normalizeSong).filter((s) => validateTrackIdentity(s).valid);
      return {
        songs: normalized,
        hasMore: res.data.hasMore ?? false,
        total: res.data.total ?? normalized.length,
      };
    }
  } catch (error) {
    console.warn("Backend Relief Service notice:", error.message);
  }

  const fallback = getFallbackSongsByMood(toMood || "calm");
  const sliced = fallback.slice(offset, offset + limit);
  return {
    songs: sliced,
    hasMore: offset + limit < fallback.length,
    total: fallback.length,
  };
};

/**
 * Global Spotify Search Service with Pagination
 */
export const searchMusic = async (query, limit = 10, offset = 0) => {
  if (!query || query.trim() === "") return { songs: [], hasMore: false, total: 0 };

  try {
    const res = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: query.trim(), limit, offset },
      timeout: 8000,
    });

    if (res.data && res.data.data) {
      const normalized = res.data.data.map(normalizeSong).filter((s) => validateTrackIdentity(s).valid);
      return {
        songs: normalized,
        hasMore: res.data.hasMore ?? false,
        total: res.data.total ?? normalized.length,
      };
    }
  } catch (error) {
    console.warn("Backend Search Service notice:", error.message);
  }

  const fallback = getFallbackSongsByMood("neutral").filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase())
  );
  const sliced = fallback.slice(offset, offset + limit);

  return {
    songs: sliced,
    hasMore: offset + limit < fallback.length,
    total: fallback.length,
  };
};

/**
 * Compatibility alias
 */
export const getRecommendationsForMood = async (lockedMood, targetReliefMood = null, limit = 10, offset = 0) => {
  if (targetReliefMood) {
    return getReliefMusicJourney(lockedMood, targetReliefMood, limit, offset);
  }
  return discoverByMood(lockedMood, limit, offset);
};

/**
 * Canonical fallback catalog with verified Spotify web search URLs
 */
const getFallbackSongsByMood = (mood) => {
  const sampleTracks = [
    {
      id: "sp-arabic-kuthu",
      spotifyId: "sp-arabic-kuthu",
      title: "Arabic Kuthu - Halamithi Habibo",
      artist: "Anirudh Ravichander, Jonita Gandhi",
      album: "Beast",
      mood: "happy",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop",
      externalUrl: "https://open.spotify.com/search/Arabic%20Kuthu%20Anirudh",
      spotifyUri: "spotify:search:Arabic%20Kuthu%20Anirudh",
    },
    {
      id: "sp-jimikki-ponnu",
      spotifyId: "sp-jimikki-ponnu",
      title: "Jimikki Ponnu",
      artist: "Anirudh Ravichander, Jonita Gandhi",
      album: "Varisu",
      mood: "happy",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop",
      externalUrl: "https://open.spotify.com/search/Jimikki%20Ponnu%20Varisu",
      spotifyUri: "spotify:search:Jimikki%20Ponnu%20Varisu",
    },
    {
      id: "sp-naa-ready",
      spotifyId: "sp-naa-ready",
      title: "Naa Ready",
      artist: "Thalapathy Vijay, Anirudh Ravichander",
      album: "Leo",
      mood: "excited",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop",
      externalUrl: "https://open.spotify.com/search/Naa%20Ready%20Leo%20Vijay",
      spotifyUri: "spotify:search:Naa%20Ready%20Leo%20Vijay",
    },
    {
      id: "sp-vathi-coming",
      spotifyId: "sp-vathi-coming",
      title: "Vathi Coming",
      artist: "Anirudh Ravichander",
      album: "Master",
      mood: "excited",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop",
      externalUrl: "https://open.spotify.com/search/Vathi%20Coming%20Master",
      spotifyUri: "spotify:search:Vathi%20Coming%20Master",
    },
    {
      id: "sp-nenjame",
      spotifyId: "sp-nenjame",
      title: "Nenjame",
      artist: "Anirudh Ravichander",
      album: "Doctor",
      mood: "sad",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop",
      externalUrl: "https://open.spotify.com/search/Nenjame%20Doctor%20Anirudh",
      spotifyUri: "spotify:search:Nenjame%20Doctor%20Anirudh",
    },
    {
      id: "sp-ennodu-nee",
      spotifyId: "sp-ennodu-nee",
      title: "Ennodu Nee Irundhaal",
      artist: "A. R. Rahman, Sid Sriram",
      album: "I",
      mood: "sad",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop",
      externalUrl: "https://open.spotify.com/search/Ennodu%20Nee%20Irundhaal%20AR%20Rahman",
      spotifyUri: "spotify:search:Ennodu%20Nee%20Irundhaal%20AR%20Rahman",
    },
    {
      id: "sp-kannazhaga",
      spotifyId: "sp-kannazhaga",
      title: "Kannazhaga",
      artist: "Dhanush, Shruti Haasan, Anirudh",
      album: "3",
      mood: "calm",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop",
      externalUrl: "https://open.spotify.com/search/Kannazhaga%20Dhanush",
      spotifyUri: "spotify:search:Kannazhaga%20Dhanush",
    },
  ];

  const matched = sampleTracks.filter((s) => s.mood === mood.toLowerCase());
  return (matched.length > 0 ? matched : sampleTracks).map(normalizeSong);
};
