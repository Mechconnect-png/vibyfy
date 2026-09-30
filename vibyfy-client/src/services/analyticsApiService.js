/**
 * VIBYFY Analytics — Frontend API Key Service
 *
 * Communicates with the /api/analytics/* management endpoints.
 * All management calls send the Firebase ID token in X-Firebase-Token.
 */
import { auth } from "../config/firebase";
import API_BASE_URL from "../config/apiConfig";

/** Get the current Firebase ID token with graceful fallback for guest/dev mode */
const getIdToken = async () => {
  try {
    // If Firebase auth is ready and user is signed in
    if (auth?.currentUser) {
      return await auth.currentUser.getIdToken(/* forceRefresh */ false);
    }

    // If auth is still initializing, wait briefly for authStateReady
    if (typeof auth?.authStateReady === "function") {
      await auth.authStateReady();
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken(false);
      }
    }
  } catch (e) {
    console.warn("Could not retrieve Firebase ID token, using guest session:", e.message);
  }

  // Fallback for dev / guest sessions
  let guestUid = localStorage.getItem("vibyfy_guest_uid");
  if (!guestUid) {
    guestUid = "user_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("vibyfy_guest_uid", guestUid);
  }
  return `dev_token_${guestUid}`;
};

/** Base fetch wrapper with Firebase auth header and error normalization */
const apiFetch = async (path, options = {}) => {
  const token = await getIdToken();
  const url = `${API_BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Firebase-Token": token,
        ...(options.headers || {}),
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    if (err.name === "TypeError" && (err.message.includes("fetch") || err.message.includes("NetworkError"))) {
      throw new Error(
        `Cannot connect to VIBYFY server at ${API_BASE_URL}. Ensure the backend is running on port 5000.`
      );
    }
    throw err;
  }
};

// ── API Key Management ──────────────────────────────────────────────────────

/** Fetch all API keys for the authenticated user */
export const fetchApiKeys = () => apiFetch("/api/analytics/keys");

/**
 * Create a new API key.
 * Returns the full key — must be shown to the user ONCE and never again.
 */
export const createApiKey = (name, projectName = "Default Project") =>
  apiFetch("/api/analytics/keys", {
    method: "POST",
    body: JSON.stringify({ name, projectName }),
  });

/** Revoke (delete) an API key by ID */
export const revokeApiKey = (keyId) =>
  apiFetch(`/api/analytics/keys/${keyId}`, { method: "DELETE" });

/** Fetch aggregated event stats */
export const fetchAnalyticsStats = () => apiFetch("/api/analytics/stats");

/** Fetch recent events (dashboard preview) */
export const fetchRecentEvents = (limit = 50) =>
  apiFetch(`/api/analytics/events?limit=${limit}`);

/** Check analytics API health */
export const checkAnalyticsHealth = () =>
  fetch(`${API_BASE_URL}/api/analytics/health`)
    .then((r) => r.json())
    .catch((err) => ({ success: false, error: err.message }));

export default {
  fetchApiKeys,
  createApiKey,
  revokeApiKey,
  fetchAnalyticsStats,
  fetchRecentEvents,
  checkAnalyticsHealth,
};
