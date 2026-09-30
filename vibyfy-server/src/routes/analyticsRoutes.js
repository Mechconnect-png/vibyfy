/**
 * VIBYFY Analytics — Route Definitions
 *
 * Public ingestion endpoint (requires API key):
 *   POST   /api/analytics/events
 *   POST   /api/analytics/event
 *   POST   /api/analytics
 *   POST   /api/events
 *
 * Management endpoints (requires Firebase ID token):
 *   POST   /api/analytics/keys
 *   GET    /api/analytics/keys
 *   DELETE /api/analytics/keys/:keyId
 *   GET    /api/analytics/stats
 *   GET    /api/analytics/events  (dashboard preview)
 */
import express from "express";
import rateLimit from "express-rate-limit";
import { requireApiKey } from "../middleware/analyticsAuthMiddleware.js";
import { requireFirebaseAuth } from "../middleware/firebaseAuthMiddleware.js";
import { postAnalyticsEvent } from "../controllers/analyticsEventsController.js";
import {
  createKey,
  getKeys,
  deleteKey,
  getStats,
  getEvents,
} from "../controllers/analyticsKeysController.js";

const router = express.Router();

// ─── Rate limiters ────────────────────────────────────────────────────────────

/** External tracker rate limiter: 300 events per minute per IP */
const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Rate limit exceeded. Please slow down event tracking." },
  skip: (req) => process.env.NODE_ENV === "test",
});

/** Management endpoints: 60 requests per minute per IP */
const manageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please wait a moment." },
  skip: (req) => process.env.NODE_ENV === "test",
});

// ─── Public Event Ingestion (with plural and singular aliases) ────────────────

/**
 * POST /api/analytics/events (Standard)
 * POST /api/analytics/event
 * POST /api/analytics/
 * POST /api/events
 */
router.post("/events", ingestLimiter, requireApiKey, postAnalyticsEvent);
router.post("/event", ingestLimiter, requireApiKey, postAnalyticsEvent);
router.post("/", (req, res, next) => {
  // If request has Bearer auth or event body, route to event ingestion
  if (req.headers["authorization"] || req.body?.event) {
    return requireApiKey(req, res, () => postAnalyticsEvent(req, res));
  }
  // Otherwise return API info
  return res.json({
    success: true,
    service: "VIBYFY Analytics API",
    endpoint: "POST /api/analytics/events",
  });
});

// ─── Management Endpoints (Firebase Auth required) ────────────────────────────

/** POST /api/analytics/keys — Create a new API key */
router.post("/keys", manageLimiter, requireFirebaseAuth, createKey);

/** GET /api/analytics/keys — List all keys for the authenticated user */
router.get("/keys", manageLimiter, requireFirebaseAuth, getKeys);

/** DELETE /api/analytics/keys/:keyId — Revoke a key */
router.delete("/keys/:keyId", manageLimiter, requireFirebaseAuth, deleteKey);

/** GET /api/analytics/stats — Aggregated event stats */
router.get("/stats", manageLimiter, requireFirebaseAuth, getStats);

/** GET /api/analytics/events — Recent event stream (dashboard preview) */
router.get("/events", manageLimiter, requireFirebaseAuth, getEvents);
router.get("/event", manageLimiter, requireFirebaseAuth, getEvents);

// ─── Health / Info ────────────────────────────────────────────────────────────

router.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "VIBYFY Analytics API",
    version: "1.0.0",
    endpoints: {
      ingest: "POST /api/analytics/events  (Bearer sk_live_...)",
      keys: "GET|POST /api/analytics/keys  (X-Firebase-Token)",
      revoke: "DELETE /api/analytics/keys/:keyId  (X-Firebase-Token)",
      stats: "GET /api/analytics/stats  (X-Firebase-Token)",
    },
  });
});

export default router;
