import {
  discoverByMoodService,
  discoverReliefService,
  searchMusicService,
} from "../services/spotifyService.js";

/**
 * Controller: GET /api/music/discover?mood=sad&limit=10&offset=0
 */
export const discoverByMood = async (req, res) => {
  try {
    const mood = req.query.mood || "neutral";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await discoverByMoodService(mood, limit, offset);
    return res.json({
      success: true,
      mood: mood.toLowerCase(),
      limit: result.limit,
      offset: result.offset,
      hasMore: result.hasMore,
      total: result.total,
      count: result.data.length,
      provider: "spotify",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in discoverByMood controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to discover Spotify music for mood.",
    });
  }
};

/**
 * Controller: GET /api/music/search?q=anirudh&type=track,artist,album,playlist&limit=20
 */
export const searchMusic = async (req, res) => {
  try {
    const query = req.query.q || "";
    const type = req.query.type || "track";
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await searchMusicService(query, limit, offset, type);
    return res.json({
      success: true,
      query,
      type,
      limit: result.limit,
      offset: result.offset,
      hasMore: result.hasMore,
      total: result.total,
      count: result.data.length,
      provider: "spotify",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in searchMusic controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to execute Spotify music search.",
    });
  }
};

/**
 * Controller: GET /api/music/relief?from=sad&to=calm&limit=10&offset=0
 */
export const getReliefMusic = async (req, res) => {
  try {
    const fromMood = req.query.from || "sad";
    const toMood = req.query.to || "calm";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const result = await discoverReliefService(fromMood, toMood, limit, offset);
    return res.json({
      success: true,
      fromMood,
      toMood,
      limit: result.limit,
      offset: result.offset,
      hasMore: result.hasMore,
      total: result.total,
      count: result.data.length,
      provider: "spotify",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in getReliefMusic controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to discover Spotify relief music journey.",
    });
  }
};

/**
 * Controller: GET /api/music/trending
 */
export const getTrending = async (req, res) => {
  try {
    const result = await discoverByMoodService("neutral", 10, 0);
    return res.json({
      success: true,
      count: result.data.length,
      provider: "spotify",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in getTrending controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending Spotify music.",
    });
  }
};
