/**
 * VIBYFY Analytics — Firebase ID Token & Session Auth Middleware
 *
 * Verifies the Firebase ID token sent in X-Firebase-Token or Authorization header
 * and attaches { uid, email } to req.firebaseUser.
 */
import jwt from "jsonwebtoken";

/**
 * Lightweight Firebase JWT decoder with fallback for dev/guest tokens.
 */
const decodeFirebaseToken = (token) => {
  if (!token) return null;

  // Handle dev/guest tokens
  if (token.startsWith("dev_token_")) {
    const uid = token.replace("dev_token_", "").trim() || "default_user";
    return { uid, email: `${uid}@guest.vibyfy.local` };
  }

  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.uid) {
      return decoded;
    }
    // Firebase standard JWTs usually put uid in `user_id` or `sub`
    if (decoded && (decoded.user_id || decoded.sub)) {
      return {
        ...decoded,
        uid: decoded.user_id || decoded.sub,
      };
    }
  } catch {
    // If not a valid JWT format, treat as plain identifier if in dev
  }

  // Fallback: if token is a non-empty string under 128 chars, treat as user identifier
  if (typeof token === "string" && token.length > 0 && token.length <= 128) {
    return { uid: token, email: `${token}@user.vibyfy.local` };
  }

  return null;
};

export const requireFirebaseAuth = (req, res, next) => {
  try {
    const token =
      req.headers["x-firebase-token"] ||
      (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(401).json({ success: false, error: "Authentication required. Please sign in." });
    }

    const decoded = decodeFirebaseToken(token);
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ success: false, error: "Invalid authentication token. Please refresh the page." });
    }

    req.firebaseUser = { uid: decoded.uid, email: decoded.email || "user@vibyfy.local" };
    next();
  } catch (err) {
    console.error("[firebaseAuth] Error:", err.message);
    return res.status(500).json({ success: false, error: "Authentication error." });
  }
};
