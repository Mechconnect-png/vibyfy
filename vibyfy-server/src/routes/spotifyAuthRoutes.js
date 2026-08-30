import express from "express";
import {
  getAuthUrl,
  handleCallback,
  getUserStatus,
  startUserPlayback,
} from "../controllers/spotifyAuthController.js";

const router = express.Router();

router.get("/auth-url", getAuthUrl);
router.post("/callback", handleCallback);
router.get("/user-status", getUserStatus);
router.post("/play", startUserPlayback);

export default router;
