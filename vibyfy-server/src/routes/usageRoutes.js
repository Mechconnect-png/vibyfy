import express from "express";
import {
  getUsageStatus,
  recordMoodScan,
  recordReliefSession,
  recordAdWatch,
  upgradeUserPlan,
} from "../controllers/usageController.js";

const router = express.Router();

router.get("/status", getUsageStatus);
router.post("/scan", recordMoodScan);
router.post("/relief", recordReliefSession);
router.post("/watch-ad", recordAdWatch);
router.post("/upgrade-plan", upgradeUserPlan);

export default router;
