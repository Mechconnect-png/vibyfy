// VIBYFY Centralized Usage & Freemium Monetization Controller

const BASE_DAILY_SCAN_LIMIT = 5;
const BASE_DAILY_RELIEF_LIMIT = 5;

// In-Memory Usage Store: Keyed by `${userId}_${dateStr}`
const usageStore = new Map();

// User Plan Store: Keyed by `userId` (Default: "free")
const userPlans = new Map();

const getTodayDateStr = () => {
  return new Date().toISOString().split("T")[0];
};

const getUserRecord = (userId = "default_user") => {
  const dateStr = getTodayDateStr();
  const key = `${userId}_${dateStr}`;
  const plan = userPlans.get(userId) || "free";

  if (!usageStore.has(key)) {
    usageStore.set(key, {
      userId,
      date: dateStr,
      moodScansUsed: 0,
      reliefSessionsUsed: 0,
      adsWatchedScan: 0,
      adsWatchedRelief: 0,
      extraMoodScansUnlocked: 0,
      extraReliefUnlocked: 0,
    });
  }

  const record = usageStore.get(key);
  const totalAllowedScans = plan === "premium" ? 999999 : BASE_DAILY_SCAN_LIMIT + record.extraMoodScansUnlocked;
  const totalAllowedRelief = plan === "premium" ? 999999 : BASE_DAILY_RELIEF_LIMIT + record.extraReliefUnlocked;

  return {
    ...record,
    plan,
    isPremium: plan === "premium",
    baseDailyScanLimit: BASE_DAILY_SCAN_LIMIT,
    baseDailyReliefLimit: BASE_DAILY_RELIEF_LIMIT,
    totalAllowedScans,
    totalAllowedRelief,
    canScan: plan === "premium" || record.moodScansUsed < totalAllowedScans,
    canRelief: plan === "premium" || record.reliefSessionsUsed < totalAllowedRelief,
    remainingScans: plan === "premium" ? 999999 : Math.max(0, totalAllowedScans - record.moodScansUsed),
    remainingRelief: plan === "premium" ? 999999 : Math.max(0, totalAllowedRelief - record.reliefSessionsUsed),
  };
};

/**
 * GET /api/usage/status?userId=xxx
 */
export const getUsageStatus = (req, res) => {
  try {
    const userId = req.query.userId || "default_user";
    const status = getUserRecord(userId);
    return res.json({ success: true, usage: status });
  } catch (error) {
    console.error("Error in getUsageStatus:", error);
    return res.status(500).json({ success: false, message: "Error fetching usage status." });
  }
};

/**
 * POST /api/usage/scan
 */
export const recordMoodScan = (req, res) => {
  try {
    const { userId = "default_user" } = req.body || {};
    const status = getUserRecord(userId);

    if (!status.canScan) {
      return res.status(403).json({
        success: false,
        message: "Daily Mood Scan Limit Reached. Watch ads or go Premium to unlock.",
        usage: status,
      });
    }

    const key = `${userId}_${getTodayDateStr()}`;
    const record = usageStore.get(key);
    record.moodScansUsed += 1;
    usageStore.set(key, record);

    const updatedStatus = getUserRecord(userId);
    return res.json({ success: true, message: "Mood scan recorded.", usage: updatedStatus });
  } catch (error) {
    console.error("Error in recordMoodScan:", error);
    return res.status(500).json({ success: false, message: "Error recording scan." });
  }
};

/**
 * POST /api/usage/relief
 */
export const recordReliefSession = (req, res) => {
  try {
    const { userId = "default_user" } = req.body || {};
    const status = getUserRecord(userId);

    if (!status.canRelief) {
      return res.status(403).json({
        success: false,
        message: "Daily Relief Journey Limit Reached. Watch ads or go Premium to unlock.",
        usage: status,
      });
    }

    const key = `${userId}_${getTodayDateStr()}`;
    const record = usageStore.get(key);
    record.reliefSessionsUsed += 1;
    usageStore.set(key, record);

    const updatedStatus = getUserRecord(userId);
    return res.json({ success: true, message: "Relief session recorded.", usage: updatedStatus });
  } catch (error) {
    console.error("Error in recordReliefSession:", error);
    return res.status(500).json({ success: false, message: "Error recording relief session." });
  }
};

/**
 * POST /api/usage/watch-ad
 * Condition: 2 Rewarded Ads = +1 Scan (or +1 Relief)
 */
export const recordAdWatch = (req, res) => {
  try {
    const { userId = "default_user", target = "scan" } = req.body || {};
    const key = `${userId}_${getTodayDateStr()}`;
    const record = usageStore.get(key) || getUserRecord(userId);

    if (target === "relief") {
      record.adsWatchedRelief += 1;
      record.extraReliefUnlocked = Math.floor(record.adsWatchedRelief / 2);
    } else {
      record.adsWatchedScan += 1;
      record.extraMoodScansUnlocked = Math.floor(record.adsWatchedScan / 2);
    }

    usageStore.set(key, record);
    const updatedStatus = getUserRecord(userId);
    
    return res.json({
      success: true,
      message: `Ad completed! Progress: ${target === "relief" ? record.adsWatchedRelief % 2 : record.adsWatchedScan % 2}/2`,
      usage: updatedStatus,
    });
  } catch (error) {
    console.error("Error in recordAdWatch:", error);
    return res.status(500).json({ success: false, message: "Error recording ad completion." });
  }
};

/**
 * POST /api/usage/upgrade-plan
 */
export const upgradeUserPlan = (req, res) => {
  try {
    const { userId = "default_user", plan = "premium" } = req.body || {};
    userPlans.set(userId, plan);

    const updatedStatus = getUserRecord(userId);
    return res.json({
      success: true,
      message: `User plan updated to ${plan.toUpperCase()}`,
      usage: updatedStatus,
    });
  } catch (error) {
    console.error("Error in upgradeUserPlan:", error);
    return res.status(500).json({ success: false, message: "Error updating plan." });
  }
};
