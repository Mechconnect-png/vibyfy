/**
 * VIBYFY Analytics — API Key Model (Mongoose)
 *
 * Security design:
 *  - Full key shown ONLY once at creation time.
 *  - Only a SHA-256 hash of the secret is stored in the DB.
 *  - The plaintext is NEVER persisted.
 */
import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    // Human-readable label given by the site owner
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // The prefix visible to the user (e.g. sk_live_)
    prefix: {
      type: String,
      required: true,
    },

    // SHA-256 hash of the full secret — NEVER store plaintext
    keyHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // The first 8 chars of the key after the prefix (safe to show in UI)
    keyHint: {
      type: String,
      required: true,
    },

    // Owner: Firebase UID of the authenticated P1 user
    ownerId: {
      type: String,
      required: true,
      index: true,
    },

    // Optional project/site label
    projectName: {
      type: String,
      default: "Default Project",
      trim: true,
    },

    // Whether this key is active
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Last time the key was successfully used
    lastUsedAt: {
      type: Date,
      default: null,
    },

    // Revoked timestamp (set when isActive → false)
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
    versionKey: false,
  }
);

// Compound index for fast auth lookups
apiKeySchema.index({ keyHash: 1, isActive: 1 });

const ApiKey = mongoose.model("ApiKey", apiKeySchema);
export default ApiKey;
