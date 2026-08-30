import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import musicRoutes from "./src/routes/musicRoutes.js";
import usageRoutes from "./src/routes/usageRoutes.js";
import spotifyAuthRoutes from "./src/routes/spotifyAuthRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Spotify Music API Routes
app.use("/api/music", musicRoutes);

// Mount Freemium Usage & Monetization Routes
app.use("/api/usage", usageRoutes);

// Mount Spotify OAuth User Auth & Playback Routes
app.use("/api/spotify", spotifyAuthRoutes);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VIBYFY Spotify-Powered Backend API is Running!",
    version: "2.0.0",
    brand: "VIBYFY",
    provider: "Spotify Web API",
    tagline: "Feel the vibe. Find your sound.",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VIBYFY Backend running on port ${PORT}`);
});