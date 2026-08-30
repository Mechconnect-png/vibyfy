import express from "express";
import {
  discoverByMood,
  searchMusic,
  getReliefMusic,
  getTrending,
} from "../controllers/musicController.js";

const router = express.Router();

// Spotify Music Discovery Endpoints
router.get("/discover", discoverByMood);
router.get("/search", searchMusic);
router.get("/relief", getReliefMusic);
router.get("/trending", getTrending);

export default router;
