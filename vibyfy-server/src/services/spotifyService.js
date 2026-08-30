import axios from "axios";
import { getQueriesForMood } from "../config/moodMusicMap.js";

// In-Memory Token Cache & Status Flags
let cachedAccessToken = null;
let tokenExpiresAt = 0;
let hasLoggedStatus = false;

/**
 * Spotify OAuth Token Manager (Client Credentials Flow)
 */
export const getSpotifyAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    if (!hasLoggedStatus) {
      console.log("ℹ️ Running VIBYFY Discovery Engine (Using Catalog Fallback)");
      hasLoggedStatus = true;
    }
    return null;
  }

  const now = Date.now();
  if (cachedAccessToken && now < tokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  try {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authString}`,
        },
      }
    );

    if (response.data && response.data.access_token) {
      cachedAccessToken = response.data.access_token;
      tokenExpiresAt = now + response.data.expires_in * 1000;
      if (!hasLoggedStatus) {
        console.log("✅ Spotify Access Token authenticated successfully");
        hasLoggedStatus = true;
      }
      return cachedAccessToken;
    }
  } catch (error) {
    if (!hasLoggedStatus) {
      console.log("ℹ️ Running VIBYFY Discovery Engine (Auth Error, Using Fallback)");
      hasLoggedStatus = true;
    }
    return null;
  }

  return null;
};

/**
 * Canonical Track Normalizer
 */
export const normalizeSpotifyTrack = (track, requestedMood = "neutral") => {
  if (!track) return null;

  const trackId = track.id || track.spotifyId || `sp-${Math.random().toString(36).substring(2, 9)}`;
  const title = track.name || track.title || "Untitled Track";

  const artistsList = track.artists
    ? track.artists.map((a) => (typeof a === "string" ? { id: "", name: a } : { id: a.id || "", name: a.name }))
    : [{ id: "", name: track.artist || "Unknown Artist" }];

  const primaryArtist = artistsList.map((a) => a.name).join(", ");
  const queryStr = encodeURIComponent(`${title} ${primaryArtist}`);
  
  // Use exact Spotify external URL and Spotify URI if present
  const spotifyUrl = track.external_urls?.spotify || track.externalUrl || track.spotifyUrl || `https://open.spotify.com/search/${queryStr}`;
  const spotifyUri = track.uri || track.spotifyUri || (track.id && !track.id.startsWith("sp-") ? `spotify:track:${track.id}` : `spotify:search:${queryStr}`);

  const moodStr = typeof requestedMood === "string" ? requestedMood : "neutral";
  const coverUrl = track.album?.images?.[0]?.url || track.images?.[0]?.url || track.image || track.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop";

  return {
    id: trackId,
    spotifyId: trackId,
    title,
    artist: primaryArtist,
    artists: artistsList,
    album: track.album ? (typeof track.album === "string" ? track.album : track.album.name) : "Spotify Release",
    image: coverUrl,
    cover: coverUrl,
    externalUrl: spotifyUrl,
    spotifyUrl: spotifyUrl,
    spotifyUri: spotifyUri,
    previewUrl: track.preview_url || track.previewUrl || null,
    durationMs: track.duration_ms || track.durationMs || 240000,
    duration: Math.round((track.duration_ms || track.durationMs || 240000) / 1000),
    provider: "spotify",
    mood: moodStr.toLowerCase(),
    popularity: track.popularity || 85,
  };
};

/**
 * String normalization for fuzzy comparison
 */
const normalizeStr = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Intelligent 7-Priority Exact Match Ranking Engine
 */
export const rankSearchResults = (tracks, query) => {
  if (!Array.isArray(tracks) || tracks.length === 0 || !query) return tracks || [];

  const rawQuery = query.replace(/\s+/g, " ").trim();
  const lowerQuery = rawQuery.toLowerCase();
  const normQuery = normalizeStr(rawQuery);

  const getScore = (track) => {
    if (!track) return 999;

    const title = track.title || track.name || "";
    const lowerTitle = title.toLowerCase().trim();
    const normTitle = normalizeStr(title);

    const artist = track.artist || (Array.isArray(track.artists) ? track.artists.map(a => typeof a === "string" ? a : a.name).join(", ") : "");
    const lowerArtist = artist.toLowerCase().trim();
    const normArtist = normalizeStr(artist);

    // PRIORITY 1: Exact track title match
    if (lowerTitle === lowerQuery) return 1;

    // PRIORITY 2: Case-insensitive exact match
    if (lowerTitle === lowerQuery) return 2;

    // PRIORITY 3: Normalized match (remove punctuation & extra spaces)
    if (normTitle === normQuery) return 3;

    // PRIORITY 4: Track title starts with query
    if (lowerTitle.startsWith(lowerQuery) || normTitle.startsWith(normQuery)) return 4;

    // PRIORITY 5: Track title contains query
    if (lowerTitle.includes(lowerQuery) || normTitle.includes(normQuery)) return 5;

    // PRIORITY 6: Artist match
    if (lowerArtist === lowerQuery || normArtist === normQuery || lowerArtist.includes(lowerQuery)) return 6;

    // PRIORITY 7: Partial match
    return 7;
  };

  return [...tracks].sort((a, b) => getScore(a) - getScore(b));
};

/**
 * Execute query against Spotify Search API supporting tracks, artists, albums, playlists
 */
export const searchSpotifyQuery = async (query, limit = 20, offset = 0, type = "track") => {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  const safeLimit = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));
  const safeOffset = Math.max(0, parseInt(offset, 10) || 0);
  const cleanQuery = query.replace(/\s+/g, " ").trim();

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: cleanQuery,
        type: type || "track",
        limit: safeLimit,
        offset: safeOffset,
      },
    });

    if (response.data) {
      if (response.data.tracks && response.data.tracks.items) {
        return response.data.tracks.items;
      }
      if (response.data.artists && response.data.artists.items) {
        return response.data.artists.items.map((a) => ({
          id: a.id,
          name: a.name,
          title: a.name,
          artist: "Artist",
          artists: [{ id: a.id, name: a.name }],
          album: "Spotify Artist Profile",
          images: a.images,
          external_urls: a.external_urls,
          uri: a.uri,
          popularity: a.popularity,
        }));
      }
      if (response.data.albums && response.data.albums.items) {
        return response.data.albums.items.map((alb) => ({
          id: alb.id,
          name: alb.name,
          title: alb.name,
          artist: alb.artists ? alb.artists.map((x) => x.name).join(", ") : "Various Artists",
          artists: alb.artists,
          album: alb.name,
          images: alb.images,
          external_urls: alb.external_urls,
          uri: alb.uri,
        }));
      }
      if (response.data.playlists && response.data.playlists.items) {
        return response.data.playlists.items.filter(Boolean).map((pl) => ({
          id: pl.id,
          name: pl.name,
          title: pl.name,
          artist: pl.owner ? pl.owner.display_name : "Spotify User",
          artists: [{ id: "", name: pl.owner ? pl.owner.display_name : "Spotify User" }],
          album: "Spotify Playlist",
          images: pl.images,
          external_urls: pl.external_urls,
          uri: pl.uri,
        }));
      }
    }
  } catch (err) {
    console.warn("Spotify API query search notice:", err.message);
  }

  return [];
};

/**
 * Multi-query Spotify discovery by mood with pagination support
 */
export const discoverByMoodService = async (mood = "neutral", limit = 10, offset = 0) => {
  const targetMood = (typeof mood === "string" ? mood : "neutral").toLowerCase();
  const queries = getQueriesForMood(targetMood) || ["Tamil trending songs"];
  const safeLimit = Math.max(1, parseInt(limit, 10) || 10);
  const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

  const token = await getSpotifyAccessToken();
  let allNormalizedTracks = [];

  if (token) {
    let rawTracks = [];
    const queryOffset = Math.floor(safeOffset / Math.max(1, queries.length));

    for (const query of queries) {
      const fetched = await searchSpotifyQuery(query, safeLimit, queryOffset, "track");
      if (fetched && fetched.length > 0) {
        rawTracks = [...rawTracks, ...fetched];
      }
    }

    if (rawTracks.length > 0) {
      const trackMap = new Map();
      rawTracks.forEach((t) => {
        if (t && t.id && !trackMap.has(t.id)) {
          trackMap.set(t.id, t);
        }
      });
      allNormalizedTracks = Array.from(trackMap.values()).map((t) => normalizeSpotifyTrack(t, targetMood));
    }
  }

  if (allNormalizedTracks.length === 0) {
    allNormalizedTracks = getMockSpotifyTracks(targetMood);
  }

  const sliced = allNormalizedTracks.slice(safeOffset, safeOffset + safeLimit);
  const hasMore = safeOffset + safeLimit < allNormalizedTracks.length;

  return {
    data: sliced,
    total: allNormalizedTracks.length,
    limit: safeLimit,
    offset: safeOffset,
    hasMore,
  };
};

/**
 * Multi-query Spotify discovery for Relief Zone with pagination
 */
export const discoverReliefService = async (fromMood = "sad", toMood = "calm", limit = 10, offset = 0) => {
  const targetMood = (typeof toMood === "string" ? toMood : "calm").toLowerCase();
  const fromQueries = getQueriesForMood(fromMood) || ["Tamil sad songs"];
  const toQueries = getQueriesForMood(targetMood) || ["Tamil calm songs"];
  const combinedQueries = [...toQueries.slice(0, 3), ...fromQueries.slice(0, 2)];

  const safeLimit = Math.max(1, parseInt(limit, 10) || 10);
  const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

  const token = await getSpotifyAccessToken();
  let allNormalizedTracks = [];

  if (token) {
    let rawTracks = [];
    const queryOffset = Math.floor(safeOffset / Math.max(1, combinedQueries.length));

    for (const query of combinedQueries) {
      const fetched = await searchSpotifyQuery(query, safeLimit, queryOffset, "track");
      if (fetched && fetched.length > 0) {
        rawTracks = [...rawTracks, ...fetched];
      }
    }

    if (rawTracks.length > 0) {
      const trackMap = new Map();
      rawTracks.forEach((t) => {
        if (t && t.id && !trackMap.has(t.id)) {
          trackMap.set(t.id, t);
        }
      });
      allNormalizedTracks = Array.from(trackMap.values()).map((t) => normalizeSpotifyTrack(t, targetMood));
    }
  }

  if (allNormalizedTracks.length === 0) {
    allNormalizedTracks = getMockSpotifyTracks(targetMood);
  }

  const sliced = allNormalizedTracks.slice(safeOffset, safeOffset + safeLimit);
  const hasMore = safeOffset + safeLimit < allNormalizedTracks.length;

  return {
    data: sliced,
    total: allNormalizedTracks.length,
    limit: safeLimit,
    offset: safeOffset,
    hasMore,
  };
};

/**
 * Direct search query execution with intelligent exact match ranking (NEVER dumps unrelated fallback songs)
 */
export const searchMusicService = async (query, limit = 20, offset = 0, type = "track") => {
  const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
  const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

  if (!query || !query.trim()) {
    return { data: [], total: 0, limit: safeLimit, offset: safeOffset, hasMore: false };
  }

  const cleanQuery = query.replace(/\s+/g, " ").trim();
  const token = await getSpotifyAccessToken();
  let allNormalizedTracks = [];

  if (token) {
    const rawTracks = await searchSpotifyQuery(cleanQuery, safeLimit, safeOffset, type);
    if (rawTracks && rawTracks.length > 0) {
      allNormalizedTracks = rawTracks.map((t) => normalizeSpotifyTrack(t, "search"));
    }
  }

  // Fallback search strictly filters by query keywords; if 0 match, returns empty list []
  if (allNormalizedTracks.length === 0) {
    const catalog = getMockSpotifyTracks("neutral");
    const normQ = normalizeStr(cleanQuery);
    allNormalizedTracks = catalog.filter(
      (s) => normalizeStr(s.title).includes(normQ) || normalizeStr(s.artist).includes(normQ) || normalizeStr(s.album).includes(normQ)
    );
  }

  // Rank results so exact match appears FIRST
  const rankedTracks = rankSearchResults(allNormalizedTracks, cleanQuery);

  const sliced = rankedTracks.slice(safeOffset, safeOffset + safeLimit);
  const hasMore = safeOffset + safeLimit < rankedTracks.length;

  return {
    data: sliced,
    total: rankedTracks.length,
    limit: safeLimit,
    offset: safeOffset,
    hasMore,
  };
};

/**
 * High quality canonical catalog for multi-page recommendations
 */
const getMockSpotifyTracks = (mood = "neutral") => {
  const targetMoodStr = typeof mood === "string" ? mood : "neutral";
  const catalog = [
    // HAPPY TRACKS
    { id: "sp-h1", title: "Arabic Kuthu - Halamithi Habibo", artist: "Anirudh Ravichander, Jonita Gandhi", album: "Beast", mood: "happy", externalUrl: "https://open.spotify.com/search/Arabic%20Kuthu%20Anirudh" },
    { id: "sp-h2", title: "Jimikki Ponnu", artist: "Anirudh Ravichander, Jonita Gandhi", album: "Varisu", mood: "happy", externalUrl: "https://open.spotify.com/search/Jimikki%20Ponnu%20Varisu" },
    { id: "sp-h3", title: "Chellamma", artist: "Anirudh Ravichander, Jonita Gandhi", album: "Doctor", mood: "happy", externalUrl: "https://open.spotify.com/search/Chellamma%20Doctor" },
    { id: "sp-h4", title: "Rowdy Baby", artist: "Dhanush, Dhee, Yuvan Shankar Raja", album: "Maari 2", mood: "happy", externalUrl: "https://open.spotify.com/search/Rowdy%20Baby%20Dhanush" },
    { id: "sp-h5", title: "Ranjithame", artist: "Thalapathy Vijay, M.M. Manasi", album: "Varisu", mood: "happy", externalUrl: "https://open.spotify.com/search/Ranjithame%20Vijay" },
    { id: "sp-h6", title: "Kavalayya", artist: "Anirudh Ravichander, Shilpa Rao", album: "Jailer", mood: "happy", externalUrl: "https://open.spotify.com/search/Kavalayya%20Jailer" },
    { id: "sp-h7", title: "Two Two Two", artist: "Anirudh Ravichander", album: "Kaathuvaakula Rendu Kaadhal", mood: "happy", externalUrl: "https://open.spotify.com/search/Two%20Two%20Two%20Anirudh" },
    { id: "sp-h8", title: "Private Party", artist: "Anirudh Ravichander, Jonita Gandhi", album: "Don", mood: "happy", externalUrl: "https://open.spotify.com/search/Private%20Party%20Don" },
    { id: "sp-h9", title: "Vaathi Raid", artist: "Anirudh Ravichander, Arivu", album: "Master", mood: "happy", externalUrl: "https://open.spotify.com/search/Vaathi%20Raid%20Master" },
    { id: "sp-h10", title: "Surviva", artist: "Anirudh Ravichander, Yogi B", album: "Vivegam", mood: "happy", externalUrl: "https://open.spotify.com/search/Surviva%20Vivegam" },

    // SAD TRACKS
    { id: "sp-s1", title: "Nenjame", artist: "Anirudh Ravichander", album: "Doctor", mood: "sad", externalUrl: "https://open.spotify.com/search/Nenjame%20Doctor%20Anirudh" },
    { id: "sp-s2", title: "Ennodu Nee Irundhaal", artist: "A. R. Rahman, Sid Sriram", album: "I", mood: "sad", externalUrl: "https://open.spotify.com/search/Ennodu%20Nee%20Irundhaal%20AR%20Rahman" },
    { id: "sp-s3", title: "Kadhaippoma", artist: "Sid Sriram, Leon James", album: "Oh My Kadavule", mood: "sad", externalUrl: "https://open.spotify.com/search/Kadhaippoma%20Sid%20Sriram" },
    { id: "sp-s4", title: "Po Nee Po", artist: "Anirudh Ravichander, Mohit Chauhan", album: "3", mood: "sad", externalUrl: "https://open.spotify.com/search/Po%20Nee%20Po%20Anirudh" },
    { id: "sp-s5", title: "Maruvaarthai", artist: "Sid Sriram, Darbuka Siva", album: "Enai Noki Paayum Thota", mood: "sad", externalUrl: "https://open.spotify.com/search/Maruvaarthai%20Sid%20Sriram" },

    // CALM TRACKS
    { id: "sp-c1", title: "Kannazhaga", artist: "Dhanush, Shruti Haasan, Anirudh", album: "3", mood: "calm", externalUrl: "https://open.spotify.com/search/Kannazhaga%20Dhanush" },
    { id: "sp-c2", title: "Megham Karukatha", artist: "Dhanush, Anirudh Ravichander", album: "Thiruchitrambalam", mood: "calm", externalUrl: "https://open.spotify.com/search/Megham%20Karukatha%20Dhanush" },
    { id: "sp-c3", title: "Inkem Inkem", artist: "Sid Sriram", album: "Geetha Govindam", mood: "calm", externalUrl: "https://open.spotify.com/search/Inkem%20Inkem%20Sid%20Sriram" },

    // EXCITED TRACKS
    { id: "sp-e1", title: "Naa Ready", artist: "Thalapathy Vijay, Anirudh", album: "Leo", mood: "excited", externalUrl: "https://open.spotify.com/search/Naa%20Ready%20Leo" },
    { id: "sp-e2", title: "Vathi Coming", artist: "Anirudh Ravichander", album: "Master", mood: "excited", externalUrl: "https://open.spotify.com/search/Vathi%20Coming%20Master" },
    { id: "sp-e3", title: "Badass", artist: "Anirudh Ravichander", album: "Leo", mood: "excited", externalUrl: "https://open.spotify.com/search/Badass%20Leo%20Anirudh" },
  ];

  const target = targetMoodStr.toLowerCase();
  const filtered = catalog.filter((s) => s.mood === target);
  const list = filtered.length > 0 ? filtered : catalog;
  return list.map((track) => normalizeSpotifyTrack(track, targetMoodStr));
};
