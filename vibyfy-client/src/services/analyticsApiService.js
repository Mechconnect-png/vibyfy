/**
 * VIBYFY Analytics — Frontend API Key Service
 *
 * Communicates with the /api/analytics/* management endpoints.
 * All management calls send the Firebase ID token in X-Firebase-Token.
 */
import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/** Get the current Firebase ID token */
const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.getIdToken(/* forceRefresh */ false);
};

/** Base fetch wrapper with Firebase auth header */
const apiFetch = async (path, options = {}) => {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Firebase-Token": token,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
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
  fetch(`${API_URL}/api/analytics/health`).then((r) => r.json());
