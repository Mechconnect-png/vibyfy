/**
 * VIBYFY Analytics — In-Memory Fallback Store
 *
 * Used when MongoDB is not configured.  All data is lost on restart.
 * This allows the analytics system to function in local dev without a DB.
 */

const keys = new Map();    // keyHash → apiKeyDoc
const events = [];         // flat array of event objects

// ─── API Key helpers ─────────────────────────────────────────────────────────

export const memCreateKey = (doc) => {
  keys.set(doc.keyHash, { ...doc });
  return { ...doc };
};

export const memFindKeyByHash = (keyHash) => {
  const doc = keys.get(keyHash);
  if (!doc || !doc.isActive) return null;
  return { ...doc };
};

export const memGetKeysByOwner = (ownerId) => {
  return [...keys.values()].filter((k) => k.ownerId === ownerId);
};

export const memRevokeKey = (keyId, ownerId) => {
  for (const [hash, doc] of keys.entries()) {
    if (doc._id === keyId && doc.ownerId === ownerId) {
      doc.isActive = false;
      doc.revokedAt = new Date();
      keys.set(hash, doc);
      return true;
    }
  }
  return false;
};

export const memUpdateLastUsed = (keyHash) => {
  const doc = keys.get(keyHash);
  if (doc) {
    doc.lastUsedAt = new Date();
    keys.set(keyHash, doc);
  }
};

// ─── Analytics Event helpers ──────────────────────────────────────────────────

export const memSaveEvent = (eventDoc) => {
  events.push({ ...eventDoc });
  // Keep only the last 10,000 events in memory
  if (events.length > 10000) events.splice(0, events.length - 10000);
};

export const memGetEventsByOwner = (ownerId, limit = 100) => {
  return events
    .filter((e) => e.ownerId === ownerId)
    .slice(-limit)
    .reverse();
};
