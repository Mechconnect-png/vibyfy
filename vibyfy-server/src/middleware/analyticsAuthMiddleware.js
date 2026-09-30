/**
 * VIBYFY Analytics — API Key Auth Middleware
 *
 * Extracts the Bearer token from Authorization header,
 * authenticates it, and attaches apiKeyDoc to req.
 *
 * Usage:
 *   import { requireApiKey } from "./analyticsAuthMiddleware.js";
 *   router.post("/events", requireApiKey, handler);
 */
import { authenticateApiKey } from "../services/analyticsService.js";

export const requireApiKey = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Missing or malformed Authorization header. Use: Authorization: Bearer sk_live_...",
      });
    }

    const rawKey = authHeader.slice(7).trim(); // strip "Bearer "
    if (!rawKey) {
      return res.status(401).json({ success: false, error: "API key is empty." });
    }

    const apiKeyDoc = await authenticateApiKey(rawKey);
    if (!apiKeyDoc) {
      return res.status(401).json({
        success: false,
        error: "Invalid or revoked API key.",
      });
    }

    req.apiKeyDoc = apiKeyDoc;
    next();
  } catch (err) {
    console.error("[analyticsAuth] Unexpected error:", err.message);
    return res.status(500).json({ success: false, error: "Authentication error." });
  }
};
