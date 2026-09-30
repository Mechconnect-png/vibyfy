/**
 * Centralized API Configuration for VIBYFY Production & Development
 */
const getBaseUrl = () => {
  const envUrl = typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_URL : null;
  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/$/, "");
  }

  // If in browser and running on localhost or 127.0.0.1
  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
  }

  return "https://vibyfy-server.onrender.com";
};

export const API_BASE_URL = getBaseUrl();

export default API_BASE_URL;
