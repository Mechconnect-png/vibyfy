/**
 * VIBYFY Analytics — Events Controller
 *
 * POST /api/analytics/events
 *   Accepts an analytics event from an external tracker (P2).
 *   Requires: Authorization: Bearer sk_live_...
 */
import { ingestAnalyticsEvent } from "../services/analyticsService.js";

/**
 * Validate the incoming event payload.
 * Returns an array of error strings (empty = valid).
 */
const validateEventBody = (body) => {
  const errors = [];

  if (!body || typeof body !== "object") {
    return ["Request body must be a JSON object."];
  }

  if (!body.event || typeof body.event !== "string" || !body.event.trim()) {
    errors.push('"event" field is required and must be a non-empty string.');
  } else if (body.event.trim().length > 100) {
    errors.push('"event" must be 100 characters or fewer.');
  }

  if (body.page !== undefined && body.page !== null) {
    if (typeof body.page !== "string" || body.page.length > 2048) {
      errors.push('"page" must be a string of 2048 characters or fewer.');
    }
  }

  if (body.sessionId !== undefined && body.sessionId !== null) {
    if (typeof body.sessionId !== "string" || body.sessionId.length > 128) {
      errors.push('"sessionId" must be a string of 128 characters or fewer.');
    }
  }

  if (body.visitorId !== undefined && body.visitorId !== null) {
    if (typeof body.visitorId !== "string" || body.visitorId.length > 128) {
      errors.push('"visitorId" must be a string of 128 characters or fewer.');
    }
  }

  if (body.timestamp !== undefined && body.timestamp !== null) {
    const d = new Date(body.timestamp);
    if (isNaN(d.getTime())) {
      errors.push('"timestamp" must be a valid ISO 8601 date string.');
    }
  }

  if (body.metadata !== undefined && body.metadata !== null) {
    if (typeof body.metadata !== "object" || Array.isArray(body.metadata)) {
      errors.push('"metadata" must be a flat JSON object.');
    }
  }

  return errors;
};

/**
 * POST /api/analytics/events
 */
export const postAnalyticsEvent = async (req, res) => {
  try {
    const validationErrors = validateEventBody(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    const userAgent = req.headers["user-agent"] || null;
    const result = await ingestAnalyticsEvent({
      rawBody: req.body,
      apiKeyDoc: req.apiKeyDoc,
      userAgent,
    });

    return res.status(201).json({
      success: true,
      eventId: result.eventId,
    });
  } catch (err) {
    console.error("[analyticsEvents] Error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to record event." });
  }
};
