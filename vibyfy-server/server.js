import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import musicRoutes from "./src/routes/musicRoutes.js";
import usageRoutes from "./src/routes/usageRoutes.js";
import spotifyAuthRoutes from "./src/routes/spotifyAuthRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import { connectDatabase } from "./src/config/database.js";

dotenv.config();

// ─── CORS Configuration ──────────────────────────────────────────────────────
const rawOrigins = process.env.ANALYTICS_ALLOWED_ORIGINS || "";
const configuredOrigins = rawOrigins
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // curl, Postman, server-to-server

  // Any localhost or 127.0.0.1 on any port (5173, 5174, 3000, etc.)
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }

  // Tunnel and common cloud preview domains
  if (
    origin.endsWith(".devtunnels.ms") ||
    origin.endsWith(".vercel.app") ||
    origin.endsWith(".onrender.com") ||
    origin.endsWith(".netlify.app")
  ) {
    return true;
  }

  // Explicitly configured origins or wildcard
  if (configuredOrigins.includes(origin) || configuredOrigins.includes("*")) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Firebase-Token",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();

// Global CORS middleware (handles all routes and preflight OPTIONS automatically)
app.use(cors(corsOptions));

// Standard JSON body — generous limit for normal API usage
app.use(express.json({ limit: "5mb" }));

// ─── Existing Routes (unchanged) ─────────────────────────────────────────────

// Mount Spotify Music API Routes
app.use("/api/music", musicRoutes);

// Mount Freemium Usage & Monetization Routes
app.use("/api/usage", usageRoutes);

// Mount Spotify OAuth User Auth & Playback Routes
app.use("/api/spotify", spotifyAuthRoutes);

// ─── Analytics API Routes & Universal Aliases ────────────────────────────────
// Standard base routes:
app.use("/api/analytics", analyticsRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/analytics", analyticsRoutes);

// Direct event aliases:
app.use("/api/events", analyticsRoutes);
app.use("/api/event", analyticsRoutes);
app.use("/events", analyticsRoutes);
app.use("/event", analyticsRoutes);

// ─── Health Check & Root Info ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VIBYFY Spotify-Powered Backend API is Running!",
    version: "2.1.0",
    brand: "VIBYFY",
    provider: "Spotify Web API",
    tagline: "Feel the vibe. Find your sound.",
    analyticsEndpoint: "POST /api/analytics/events",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("[server] Error:", err.message);
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error.",
  });
});

// ─── Startup ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Attempt MongoDB connection (non-blocking — server still starts if DB is unavailable)
connectDatabase().catch(() => {});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VIBYFY Backend running on port ${PORT}`);
  console.log(`Analytics API available at POST /api/analytics/events`);
});