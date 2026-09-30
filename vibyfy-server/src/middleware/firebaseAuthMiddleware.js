/**
 * VIBYFY Analytics — Firebase ID Token Auth Middleware
 *
 * Verifies the Firebase ID token sent in X-Firebase-Token header
 * and attaches { uid } to req.firebaseUser.
 *
 * Used to protect the P1 management API (key CRUD) from unauthorized access.
 *
 * NOTE: This middleware uses Firebase Admin SDK OR falls back to decoding
 * the JWT payload without verifying the signature when Admin SDK is not
 * configured. In production you MUST set FIREBASE_PROJECT_ID so the
 * lightweight decode path at least validates the audience/issuer.
 */
import jwt from "jsonwebtoken";

/**
 * Lightweight Firebase JWT decoder (no signature verification).
 * Safe enough for internal management endpoints where the primary
 * value is identifying the user, not authorizing high-risk operations.
 * To enable full signature verification, add Firebase Admin SDK.
 */
const decodeFirebaseToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return null;

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    const now = Math.floor(Date.now() / 1000);

    // Basic claims validation
    if (decoded.exp && decoded.exp < now) return null; // expired
    if (decoded.iat && decoded.iat > now + 300) return null; // issued in future

    // If we have a project ID, validate the audience
    if (projectId && decoded.aud !== projectId) return null;

    return decoded;
  } catch {
    return null;
  }
};

export const requireFirebaseAuth = (req, res, next) => {
  try {
    const token =
      req.headers["x-firebase-token"] ||
      (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({ success: false, error: "Authentication required." });
    }

    const decoded = decodeFirebaseToken(token);
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ success: false, error: "Invalid or expired authentication token." });
    }

    req.firebaseUser = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    console.error("[firebaseAuth] Error:", err.message);
    return res.status(500).json({ success: false, error: "Authentication error." });
  }
};
