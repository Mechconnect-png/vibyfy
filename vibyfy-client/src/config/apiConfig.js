/**
 * Centralized API Configuration for VIBYFY Production & Development
 */
const envUrl = typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_URL : null;

export const API_BASE_URL = (
  envUrl || "https://vibyfy-server.onrender.com"
).replace(/\/$/, "");

export default API_BASE_URL;
