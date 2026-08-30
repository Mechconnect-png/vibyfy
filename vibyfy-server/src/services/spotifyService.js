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
      console.log("ℹ️ Running VIBYFY Discovery Engine");
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
  const query = encodeURIComponent(`${title} ${primaryArtist}`);
  const spotifyUrl = track.external_urls?.spotify || track.externalUrl || track.spotifyUrl || `https://open.spotify.com/search/${query}`;
  const spotifyUri = track.uri || track.spotifyUri || `spotify:search:${query}`;

  const moodStr = typeof requestedMood === "string" ? requestedMood : "neutral";

  return {
    id: trackId,
    spotifyId: trackId,
    title,
    artist: primaryArtist,
    artists: artistsList,
    album: track.album ? (typeof track.album === "string" ? track.album : track.album.name) : "Spotify Single",
    image: track.album?.images?.[0]?.url || track.image || track.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop",
    cover: track.album?.images?.[0]?.url || track.image || track.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop",
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
 * Execute single query against Spotify Search API supporting tracks, artists, albums, playlists
 */
export const searchSpotifyQuery = async (query, limit = 20, offset = 0, type = "track") => {
  const token = await getSpotifyAccessToken();
  if (!token) return null;

  const safeLimit = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));
  const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: type || "track",
        limit: safeLimit,
        offset: safeOffset,
      },
    });

    if (response.data) {
      if (response.data.tracks && response.data.tracks.items) {
        return response.data.tracks.items;
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
 * Direct search query execution with pagination returning at least 20 results
 */
export const searchMusicService = async (query, limit = 20, offset = 0, type = "track") => {
  const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
  const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

  if (!query || !query.trim()) {
    return { data: [], total: 0, limit: safeLimit, offset: safeOffset, hasMore: false };
  }

  const token = await getSpotifyAccessToken();
  let allNormalizedTracks = [];

  if (token) {
    const rawTracks = await searchSpotifyQuery(query.trim(), safeLimit, safeOffset, type);
    if (rawTracks && rawTracks.length > 0) {
      allNormalizedTracks = rawTracks.map((t) => normalizeSpotifyTrack(t, "search"));
    }
  }

  if (allNormalizedTracks.length === 0) {
    const catalog = getMockSpotifyTracks("neutral");
    const qLower = query.trim().toLowerCase();
    allNormalizedTracks = catalog.filter(
      (s) => s.title.toLowerCase().includes(qLower) || s.artist.toLowerCase().includes(qLower) || s.album.toLowerCase().includes(qLower)
    );
    if (allNormalizedTracks.length === 0) {
      allNormalizedTracks = catalog;
    }
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
    { id: "sp-h11", title: "Marana Mass", artist: "Anirudh Ravichander, SPB", album: "Petta", mood: "happy", externalUrl: "https://open.spotify.com/search/Marana%20Mass%20Petta" },
    { id: "sp-h12", title: "Chitti Dance", artist: "Anirudh Ravichander", album: "Master", mood: "happy", externalUrl: "https://open.spotify.com/search/Master%20Anirudh" },
    { id: "sp-h13", title: "Illuminati", artist: "Sushin Shyam, Dabzee", album: "Aavesham", mood: "happy", externalUrl: "https://open.spotify.com/search/Illuminati%20Aavesham" },
    { id: "sp-h14", title: "Manasilaayo", artist: "Anirudh Ravichander, Malaysia Vasudevan", album: "Vettaiyan", mood: "happy", externalUrl: "https://open.spotify.com/search/Manasilaayo%20Vettaiyan" },
    { id: "sp-h15", title: "Spark", artist: "Yuvan Shankar Raja, Vrusha", album: "GOAT", mood: "happy", externalUrl: "https://open.spotify.com/search/Spark%20GOAT" },
    { id: "sp-h16", title: "Matta", artist: "Yuvan Shankar Raja, Vijay", album: "GOAT", mood: "happy", externalUrl: "https://open.spotify.com/search/Matta%20GOAT" },
    { id: "sp-h17", title: "Whistle Podu", artist: "Thalapathy Vijay, Yuvan Shankar Raja", album: "GOAT", mood: "happy", externalUrl: "https://open.spotify.com/search/Whistle%20Podu%20GOAT" },
    { id: "sp-h18", title: "Chuttamalle", artist: "Anirudh Ravichander, Shilpa Rao", album: "Devara", mood: "happy", externalUrl: "https://open.spotify.com/search/Chuttamalle%20Devara" },
    { id: "sp-h19", title: "Fear Song", artist: "Anirudh Ravichander", album: "Devara", mood: "happy", externalUrl: "https://open.spotify.com/search/Fear%20Song%20Devara" },
    { id: "sp-h20", title: "Soukaath", artist: "Anirudh Ravichander", album: "Devara", mood: "happy", externalUrl: "https://open.spotify.com/search/Devara%20Anirudh" },

    // SAD TRACKS
    { id: "sp-s1", title: "Nenjame", artist: "Anirudh Ravichander", album: "Doctor", mood: "sad", externalUrl: "https://open.spotify.com/search/Nenjame%20Doctor%20Anirudh" },
    { id: "sp-s2", title: "Ennodu Nee Irundhaal", artist: "A. R. Rahman, Sid Sriram", album: "I", mood: "sad", externalUrl: "https://open.spotify.com/search/Ennodu%20Nee%20Irundhaal%20AR%20Rahman" },
    { id: "sp-s3", title: "Kadhaippoma", artist: "Sid Sriram, Leon James", album: "Oh My Kadavule", mood: "sad", externalUrl: "https://open.spotify.com/search/Kadhaippoma%20Sid%20Sriram" },
    { id: "sp-s4", title: "Po Nee Po", artist: "Anirudh Ravichander, Mohit Chauhan", album: "3", mood: "sad", externalUrl: "https://open.spotify.com/search/Po%20Nee%20Po%20Anirudh" },
    { id: "sp-s5", title: "Maruvaarthai", artist: "Sid Sriram, Darbuka Siva", album: "Enai Noki Paayum Thota", mood: "sad", externalUrl: "https://open.spotify.com/search/Maruvaarthai%20Sid%20Sriram" },
    { id: "sp-s6", title: "Poraanuru", artist: "A. R. Rahman, Hariharan", album: "Raavanan", mood: "sad", externalUrl: "https://open.spotify.com/search/Poraanuru%20AR%20Rahman" },
    { id: "sp-s7", title: "Kanave Kanave", artist: "Anirudh Ravichander", album: "David", mood: "sad", externalUrl: "https://open.spotify.com/search/Kanave%20Kanave%20Anirudh" },
    { id: "sp-s8", title: "Unnaal Ennaal", artist: "A. R. Rahman, Haricharan", album: "Theri", mood: "sad", externalUrl: "https://open.spotify.com/search/Unnaal%20Ennaal%20Theri" },
    { id: "sp-s9", title: "Naan Pizhai", artist: "Ravi G, Shashaa Tirupati", album: "Kaathuvaakula Rendu Kaadhal", mood: "sad", externalUrl: "https://open.spotify.com/search/Naan%20Pizhai%20Anirudh" },
    { id: "sp-s10", title: "Bae", artist: "Aditya R K, Anirudh", album: "Don", mood: "sad", externalUrl: "https://open.spotify.com/search/Bae%20Don%20Anirudh" },

    // CALM TRACKS
    { id: "sp-c1", title: "Kannazhaga", artist: "Dhanush, Shruti Haasan, Anirudh", album: "3", mood: "calm", externalUrl: "https://open.spotify.com/search/Kannazhaga%20Dhanush" },
    { id: "sp-c2", title: "Megham Karukatha", artist: "Dhanush, Anirudh Ravichander", album: "Thiruchitrambalam", mood: "calm", externalUrl: "https://open.spotify.com/search/Megham%20Karukatha%20Dhanush" },
    { id: "sp-c3", title: "Inkem Inkem", artist: "Sid Sriram", album: "Geetha Govindam", mood: "calm", externalUrl: "https://open.spotify.com/search/Inkem%20Inkem%20Sid%20Sriram" },
    { id: "sp-c4", title: "Vaa Seetha", artist: "A. R. Rahman", album: "Ponniyin Selvan", mood: "calm", externalUrl: "https://open.spotify.com/search/Vaa%20Seetha%20AR%20Rahman" },
    { id: "sp-c5", title: "Neela Vanam", artist: "Kamal Haasan, Devi Sri Prasad", album: "Manmadan Ambu", mood: "calm", externalUrl: "https://open.spotify.com/search/Neela%20Vanam" },
    { id: "sp-c6", title: "Aathangara Marame", artist: "A. R. Rahman, Mano", album: "Kizhakku Cheemayile", mood: "calm", externalUrl: "https://open.spotify.com/search/Aathangara%20Marame" },
    { id: "sp-c7", title: "Munbe Vaa", artist: "A. R. Rahman, Shreya Ghoshal", album: "Sillunu Oru Kaadhal", mood: "calm", externalUrl: "https://open.spotify.com/search/Munbe%20Vaa%20AR%20Rahman" },
    { id: "sp-c8", title: "Moongil Thottam", artist: "A. R. Rahman, Abhay Jodhpurkar", album: "Kadal", mood: "calm", externalUrl: "https://open.spotify.com/search/Moongil%20Thottam" },

    // EXCITED TRACKS
    { id: "sp-e1", title: "Naa Ready", artist: "Thalapathy Vijay, Anirudh", album: "Leo", mood: "excited", externalUrl: "https://open.spotify.com/search/Naa%20Ready%20Leo" },
    { id: "sp-e2", title: "Vathi Coming", artist: "Anirudh Ravichander", album: "Master", mood: "excited", externalUrl: "https://open.spotify.com/search/Vathi%20Coming%20Master" },
    { id: "sp-e3", title: "Badass", artist: "Anirudh Ravichander", album: "Leo", mood: "excited", externalUrl: "https://open.spotify.com/search/Badass%20Leo%20Anirudh" },
    { id: "sp-e4", title: "Hukum - Thalaivar Alappara", artist: "Anirudh Ravichander", album: "Jailer", mood: "excited", externalUrl: "https://open.spotify.com/search/Hukum%20Jailer%20Anirudh" },
    { id: "sp-e5", title: "Bloody Sweet", artist: "Anirudh Ravichander", album: "Leo", mood: "excited", externalUrl: "https://open.spotify.com/search/Bloody%20Sweet%20Leo" },
    { id: "sp-e6", title: "Vikram Title Track", artist: "Anirudh Ravichander", album: "Vikram", mood: "excited", externalUrl: "https://open.spotify.com/search/Vikram%20Title%20Track" },
  ];

  const target = targetMoodStr.toLowerCase();
  const filtered = catalog.filter((s) => s.mood === target);
  const list = filtered.length > 0 ? filtered : catalog;
  return list.map((track) => normalizeSpotifyTrack(track, targetMoodStr));
};
