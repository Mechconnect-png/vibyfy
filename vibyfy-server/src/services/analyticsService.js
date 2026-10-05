/**
 * VIBYFY Analytics — Core Service Layer
 *
 * Handles:
 *  - API key creation (secure random, hashed storage)
 *  - API key authentication
 *  - Analytics event ingestion
 *  - API key management (list, revoke)
 *
 * Automatically routes between MongoDB (if connected) and in-memory store.
 */
import crypto from "crypto";
import { isDatabaseConnected } from "../config/database.js";
import ApiKey from "../models/ApiKey.js";
import AnalyticsEvent from "../models/AnalyticsEvent.js";
import {
  memCreateKey,
  memFindKeyByHash,
  memGetKeysByOwner,
  memRevokeKey,
  memUpdateLastUsed,
  memSaveEvent,
  memGetEventsByOwner,
} from "./analyticsMemoryStore.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const KEY_PREFIX = "sk_live_";
const KEY_SECRET_BYTES = 32; // 256 bits → 64 hex chars

// ─── Crypto Helpers ───────────────────────────────────────────────────────────

/**
 * Generate a new cryptographically secure API key.
 * Returns { fullKey, prefix, keyHash, keyHint }
 */
export const generateApiKey = () => {
  const secret = crypto.randomBytes(KEY_SECRET_BYTES).toString("hex");
  const fullKey = `${KEY_PREFIX}${secret}`;
  const keyHash = crypto.createHash("sha256").update(fullKey).digest("hex");
  // Show only the first 8 chars of the secret portion in the UI hint
  const keyHint = secret.slice(0, 8);
  return { fullKey, prefix: KEY_PREFIX, keyHash, keyHint };
};

/**
 * Hash an incoming Bearer token for comparison.
 */
export const hashKey = (rawKey) => {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
};

/**
 * Generate a unique event ID with the "evt_" prefix.
 */
export const generateEventId = () => {
  return `evt_${crypto.randomBytes(12).toString("hex")}`;
};

// ─── API Key Management ───────────────────────────────────────────────────────

/**
 * Create a new API key for `ownerId`.
 * Returns the full key ONCE — the caller must pass it to the user immediately.
 */
export const createApiKey = async ({ ownerId, name, projectName }) => {
  if (!ownerId) throw new Error("ownerId is required");
  if (!name || !name.trim()) throw new Error("Key name is required");

  const { fullKey, prefix, keyHash, keyHint } = generateApiKey();
  const docData = {
    name: name.trim().slice(0, 100),
    prefix,
    keyHash,
    keyHint,
    ownerId,
    projectName: (projectName || "Default Project").trim().slice(0, 100),
    isActive: true,
    lastUsedAt: null,
    revokedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let savedDoc;
  if (isDatabaseConnected()) {
    const doc = new ApiKey(docData);
    savedDoc = await doc.save();
    savedDoc = savedDoc.toObject();
  } else {
    // In-memory fallback: assign a pseudo _id
    savedDoc = { ...docData, _id: crypto.randomBytes(12).toString("hex") };
    memCreateKey(savedDoc);
  }

  // Return the full key here — it will NEVER be retrievable again
  return { ...savedDoc, fullKey };
};

/**
 * List all API keys belonging to `ownerId`.
 * Returns safe fields only — never keyHash.
 */
export const listApiKeys = async (ownerId) => {
  if (!ownerId) return [];

  let docs;
  if (isDatabaseConnected()) {
    docs = await ApiKey.find({ ownerId })
      .select("-keyHash")
      .sort({ createdAt: -1 })
      .lean();
  } else {
    docs = memGetKeysByOwner(ownerId).map(({ keyHash, ...rest }) => rest);
  }

  return docs;
};

/**
 * Revoke (deactivate) an API key.
 */
export const revokeApiKey = async (keyId, ownerId) => {
  if (isDatabaseConnected()) {
    const result = await ApiKey.findOneAndUpdate(
      { _id: keyId, ownerId },
      { isActive: false, revokedAt: new Date() },
      { new: true }
    ).select("-keyHash");
    return !!result;
  } else {
    return memRevokeKey(keyId, ownerId);
  }
};

// ─── Authentication ───────────────────────────────────────────────────────────

/**
 * Authenticate a raw Bearer token.
 * Returns the API key document (without keyHash) or null if invalid/revoked.
 */
export const authenticateApiKey = async (rawKey) => {
  if (!rawKey || !rawKey.startsWith(KEY_PREFIX)) return null;

  const keyHash = hashKey(rawKey);

  if (isDatabaseConnected()) {
    const doc = await ApiKey.findOne({ keyHash, isActive: true })
      .select("-keyHash")
      .lean();
    if (!doc) return null;

    // Update lastUsedAt asynchronously — don't block the response
    ApiKey.findByIdAndUpdate(doc._id, { lastUsedAt: new Date() }).exec().catch(() => {});

    return doc;
  } else {
    const doc = memFindKeyByHash(keyHash);
    if (!doc) return null;
    memUpdateLastUsed(keyHash);
    const { keyHash: _removed, ...safe } = doc;
    return safe;
  }
};

// ─── Event Ingestion ──────────────────────────────────────────────────────────

/**
 * Validate and store an analytics event.
 * Returns { eventId } on success.
 */
export const ingestAnalyticsEvent = async ({ rawBody, apiKeyDoc, userAgent }) => {
  const eventId = generateEventId();

  // Sanitize metadata — remove any fields that look like PII
  let metadata = {};
  if (rawBody.metadata && typeof rawBody.metadata === "object") {
    // Allow only non-sensitive keys; strip any email/ip/name fields
    const forbidden = /email|password|token|credit|card|ssn|phone|ip_address/i;
    metadata = Object.fromEntries(
      Object.entries(rawBody.metadata).filter(
        ([k]) => !forbidden.test(k) && k.length <= 64
      )
    );
  }

  const eventDoc = {
    eventId,
    apiKeyId: apiKeyDoc._id,
    ownerId: apiKeyDoc.ownerId,
    projectName: apiKeyDoc.projectName || "Default Project",
    event: String(rawBody.event).slice(0, 100),
    page: rawBody.page ? String(rawBody.page).slice(0, 2048) : null,
    visitorId: rawBody.visitorId ? String(rawBody.visitorId).slice(0, 128) : null,
    sessionId: rawBody.sessionId ? String(rawBody.sessionId).slice(0, 128) : null,
    clientTimestamp: rawBody.timestamp ? new Date(rawBody.timestamp) : null,
    serverTimestamp: new Date(),
    // Store only the first 512 chars of UA, no further PII reduction needed
    userAgent: userAgent ? String(userAgent).slice(0, 512) : null,
    referrer: rawBody.metadata?.referrer
      ? String(rawBody.metadata.referrer).slice(0, 2048)
      : null,
    metadata,
  };

  if (isDatabaseConnected()) {
    const doc = new AnalyticsEvent(eventDoc);
    await doc.save();
  } else {
    memSaveEvent(eventDoc);
  }

  return { eventId };
};

/**
 * Get recent events for an owner (dashboard preview).
 */
export const getRecentEvents = async (ownerId, limit = 50) => {
  if (isDatabaseConnected()) {
    return AnalyticsEvent.find({ ownerId })
      .sort({ serverTimestamp: -1 })
      .limit(Math.min(limit, 200))
      .lean();
  } else {
    return memGetEventsByOwner(ownerId, limit);
  }
};

/**
 * Get aggregate event counts grouped by type for an owner.
 */
export const getEventStats = async (ownerId) => {
  if (isDatabaseConnected()) {
    const pipeline = [
      { $match: { ownerId } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ];
    return AnalyticsEvent.aggregate(pipeline);
  } else {
    const evts = memGetEventsByOwner(ownerId, 10000);
    const counts = {};
    evts.forEach((e) => {
      counts[e.event] = (counts[e.event] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => b.count - a.count);
  }
};

/**
 * Get full analytics summary (total events, unique visitors, sessions, top pages, event breakdown)
 */
export const getAnalyticsSummary = async (ownerId) => {
  const [stats, recentEvents] = await Promise.all([
    getEventStats(ownerId),
    getRecentEvents(ownerId, 1000),
  ]);

  const totalEvents = stats.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const uniqueVisitors = new Set(recentEvents.map((e) => e.visitorId).filter(Boolean)).size;
  const uniqueSessions = new Set(recentEvents.map((e) => e.sessionId).filter(Boolean)).size;

  const pageCounts = {};
  recentEvents.forEach((e) => {
    if (e.page) {
      pageCounts[e.page] = (pageCounts[e.page] || 0) + 1;
    }
  });

  const topPages = Object.entries(pageCounts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalEvents,
    uniqueVisitors,
    uniqueSessions,
    eventsByType: stats,
    topPages,
    recentEvents: recentEvents.slice(0, 20),
  };
};

