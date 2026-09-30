/**
 * VIBYFY Analytics — Analytics Event Model (Mongoose)
 *
 * Stores visitor/event data sent by external trackers (e.g. P2).
 * No PII beyond an anonymous visitor ID.
 */
import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    // Unique event ID with recognizable prefix
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Which API key ingested this event
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
      required: true,
      index: true,
    },

    // Owner UID (denormalized for fast queries)
    ownerId: {
      type: String,
      required: true,
      index: true,
    },

    // Project or site label from the API key
    projectName: {
      type: String,
      default: "Default Project",
    },

    // The event type sent by the tracker
    event: {
      type: String,
      required: true,
      maxlength: 100,
      index: true,
    },

    // URL path where the event occurred
    page: {
      type: String,
      maxlength: 2048,
      default: null,
    },

    // Anonymous visitor identifier (no PII)
    visitorId: {
      type: String,
      maxlength: 128,
      default: null,
    },

    // Session identifier
    sessionId: {
      type: String,
      maxlength: 128,
      default: null,
    },

    // Timestamp as reported by the client
    clientTimestamp: {
      type: Date,
      default: null,
    },

    // Timestamp recorded on the server
    serverTimestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Sanitized User-Agent string (no PII)
    userAgent: {
      type: String,
      maxlength: 512,
      default: null,
    },

    // Referrer URL
    referrer: {
      type: String,
      maxlength: 2048,
      default: null,
    },

    // Additional free-form metadata from the tracker
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: false, // we use serverTimestamp manually
    versionKey: false,
  }
);

// TTL index: auto-delete events older than 180 days to keep DB lean
analyticsEventSchema.index(
  { serverTimestamp: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 180 }
);

const AnalyticsEvent = mongoose.model("AnalyticsEvent", analyticsEventSchema);
export default AnalyticsEvent;
