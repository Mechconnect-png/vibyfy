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
// Configurable allowed origins via ANALYTICS_ALLOWED_ORIGINS env var.
// Format: comma-separated list, e.g. "https://p2app.com,http://localhost:3000"
const buildCorsOrigins = () => {
  const raw = process.env.ANALYTICS_ALLOWED_ORIGINS || "";
  const devOrigins = ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"];
  if (!raw.trim()) return devOrigins;
  return [
    ...devOrigins,
    ...raw.split(",").map((o) => o.trim()).filter(Boolean),
  ];
};

const allowedOrigins = buildCorsOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Firebase-Token"],
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();

// Global middleware
app.use(cors(corsOptions));

// Standard JSON body — generous limit for normal API usage
app.use(express.json({ limit: "5mb" }));

// Stricter limit for the analytics ingestion endpoint (10 KB is plenty)
app.use("/api/analytics/events", express.json({ limit: "10kb" }));

// ─── Existing Routes (unchanged) ─────────────────────────────────────────────

// Mount Spotify Music API Routes
app.use("/api/music", musicRoutes);

// Mount Freemium Usage & Monetization Routes
app.use("/api/usage", usageRoutes);

// Mount Spotify OAuth User Auth & Playback Routes
app.use("/api/spotify", spotifyAuthRoutes);

// ─── Analytics API Routes ─────────────────────────────────────────────────────
app.use("/api/analytics", analyticsRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VIBYFY Spotify-Powered Backend API is Running!",
    version: "2.1.0",
    brand: "VIBYFY",
    provider: "Spotify Web API",
    tagline: "Feel the vibe. Find your sound.",
    analytics: "POST /api/analytics/events",
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches CORS rejections and any unhandled errors
app.use((err, req, res, _next) => {
  if (err.message && err.message.startsWith("CORS:")) {
    return res.status(403).json({ success: false, error: err.message });
  }
  console.error("[server] Unhandled error:", err.message);
  return res.status(500).json({ success: false, error: "Internal server error." });
});

// ─── Startup ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Attempt MongoDB connection (non-blocking — server still starts if DB is unavailable)
connectDatabase().catch(() => {});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VIBYFY Backend running on port ${PORT}`);
  console.log(`Analytics API available at POST /api/analytics/events`);
});