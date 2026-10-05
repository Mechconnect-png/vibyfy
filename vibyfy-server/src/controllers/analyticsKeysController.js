/**
 * VIBYFY Analytics — API Key Management Controller
 *
 * All routes require Firebase Authentication (X-Firebase-Token header).
 *
 * POST   /api/analytics/keys          – Create a new key
 * GET    /api/analytics/keys          – List keys for the authenticated user
 * DELETE /api/analytics/keys/:keyId   – Revoke a key
 * GET    /api/analytics/stats         – Event stats for the authenticated user
 * GET    /api/analytics/events        – Recent events (preview)
 */
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  getRecentEvents,
  getEventStats,
  getAnalyticsSummary,
} from "../services/analyticsService.js";

/**
 * POST /api/analytics/keys
 */
export const createKey = async (req, res) => {
  try {
    const { uid } = req.firebaseUser;
    const { name, projectName } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, error: '"name" is required.' });
    }

    const result = await createApiKey({
      ownerId: uid,
      name: String(name).trim(),
      projectName: projectName ? String(projectName).trim() : "Default Project",
    });

    // Return the full key here — this is the ONLY time it is sent back
    return res.status(201).json({
      success: true,
      message: "API key created. Copy this key now — you will not be able to see it again.",
      key: {
        id: result._id,
        name: result.name,
        projectName: result.projectName,
        fullKey: result.fullKey, // ⚠️ shown once only
        keyHint: result.keyHint,
        prefix: result.prefix,
        createdAt: result.createdAt,
        isActive: result.isActive,
      },
    });
  } catch (err) {
    console.error("[keysController] createKey error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to create API key." });
  }
};

/**
 * GET /api/analytics/keys
 */
export const getKeys = async (req, res) => {
  try {
    const { uid } = req.firebaseUser;
    const keys = await listApiKeys(uid);

    // Ensure keyHash is never returned
    const safe = keys.map(({ keyHash, ...rest }) => rest);

    return res.json({ success: true, keys: safe });
  } catch (err) {
    console.error("[keysController] getKeys error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch API keys." });
  }
};

/**
 * DELETE /api/analytics/keys/:keyId
 */
export const deleteKey = async (req, res) => {
  try {
    const { uid } = req.firebaseUser;
    const { keyId } = req.params;

    if (!keyId) {
      return res.status(400).json({ success: false, error: "keyId is required." });
    }

    const revoked = await revokeApiKey(keyId, uid);
    if (!revoked) {
      return res.status(404).json({ success: false, error: "Key not found or already revoked." });
    }

    return res.json({ success: true, message: "API key revoked successfully." });
  } catch (err) {
    console.error("[keysController] deleteKey error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to revoke API key." });
  }
};

/**
 * GET /api/analytics/stats
 */
export const getStats = async (req, res) => {
  try {
    const { uid } = req.firebaseUser;
    const stats = await getEventStats(uid);
    return res.json({ success: true, stats });
  } catch (err) {
    console.error("[keysController] getStats error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch stats." });
  }
};

/**
 * GET /api/analytics/events
 */
export const getEvents = async (req, res) => {
  try {
    const { uid } = req.firebaseUser;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const events = await getRecentEvents(uid, limit);
    return res.json({ success: true, events });
  } catch (err) {
    console.error("[keysController] getEvents error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch events." });
  }
};

/**
 * GET /api/analytics/summary
 */
export const getSummary = async (req, res) => {
  try {
    const { uid } = req.firebaseUser;
    const summary = await getAnalyticsSummary(uid);
    return res.json({ success: true, summary });
  } catch (err) {
    console.error("[keysController] getSummary error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch summary." });
  }
};

