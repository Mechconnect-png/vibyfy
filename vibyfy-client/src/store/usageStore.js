import { create } from "zustand";
import { doc, getDoc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import useSubscriptionStore from "./subscriptionStore";

const BASE_DAILY_LIMIT = 5;

const getTodayStr = () => new Date().toISOString().split("T")[0];

const useUsageStore = create((set, get) => ({
  usage: {
    moodScansUsed: 0,
    reliefSessionsUsed: 0,
    adsWatchedScan: 0,
    adsWatchedRelief: 0,
    extraMoodScansUnlocked: 0,
    extraReliefUnlocked: 0,
    baseDailyScanLimit: BASE_DAILY_LIMIT,
    baseDailyReliefLimit: BASE_DAILY_LIMIT,
    totalAllowedScans: BASE_DAILY_LIMIT,
    totalAllowedRelief: BASE_DAILY_LIMIT,
    canScan: true,
    canRelief: true,
    remainingScans: BASE_DAILY_LIMIT,
    remainingRelief: BASE_DAILY_LIMIT,
    usageDate: getTodayStr(),
  },
  isLoading: false,

  /**
   * Fetch & Initialize Per-User Usage from Firestore with Daily Reset
   */
  fetchUsageStatus: async () => {
    const user = auth.currentUser;
    if (!user || !user.uid) {
      console.warn("⚠️ fetchUsageStatus: User not authenticated yet.");
      return;
    }

    set({ isLoading: true });
    const today = getTodayStr();
    const uid = user.uid;
    const docRef = doc(db, "usage", uid);

    try {
      const snap = await getDoc(docRef);
      let data = null;

      if (!snap.exists()) {
        // Initialize new user usage document
        data = {
          uid,
          moodScansUsed: 0,
          reliefSessionsUsed: 0,
          adsWatchedScan: 0,
          adsWatchedRelief: 0,
          plan: "free",
          usageDate: today,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(docRef, data, { merge: true });
      } else {
        data = snap.data();

        // DAILY RESET SYSTEM: Check if stored usageDate != today
        if (data.usageDate !== today) {
          data.moodScansUsed = 0;
          data.reliefSessionsUsed = 0;
          data.usageDate = today;
          data.updatedAt = serverTimestamp();

          await setDoc(
            docRef,
            { moodScansUsed: 0, reliefSessionsUsed: 0, usageDate: today, updatedAt: serverTimestamp() },
            { merge: true }
          );
        }
      }

      const isPremium = useSubscriptionStore.getState().isPremium;
      const extraScans = Math.floor((data.adsWatchedScan || 0) / 2);
      const extraRelief = Math.floor((data.adsWatchedRelief || 0) / 2);
      const totalAllowedScans = BASE_DAILY_LIMIT + extraScans;
      const totalAllowedRelief = BASE_DAILY_LIMIT + extraRelief;

      const scansUsed = data.moodScansUsed || 0;
      const reliefUsed = data.reliefSessionsUsed || 0;

      const canScan = isPremium || scansUsed < totalAllowedScans;
      const canRelief = isPremium || reliefUsed < totalAllowedRelief;

      const updatedUsage = {
        moodScansUsed: scansUsed,
        reliefSessionsUsed: reliefUsed,
        adsWatchedScan: data.adsWatchedScan || 0,
        adsWatchedRelief: data.adsWatchedRelief || 0,
        extraMoodScansUnlocked: extraScans,
        extraReliefUnlocked: extraRelief,
        baseDailyScanLimit: BASE_DAILY_LIMIT,
        baseDailyReliefLimit: BASE_DAILY_LIMIT,
        totalAllowedScans,
        totalAllowedRelief,
        canScan,
        canRelief,
        remainingScans: isPremium ? 9999 : Math.max(0, totalAllowedScans - scansUsed),
        remainingRelief: isPremium ? 9999 : Math.max(0, totalAllowedRelief - reliefUsed),
        usageDate: today,
      };

      set({ usage: updatedUsage, isLoading: false });

      if (import.meta.env.DEV) {
        console.log("📊 [VIBYFY Usage Debug]", {
          uid,
          email: user.email,
          scansUsed,
          scanLimit: totalAllowedScans,
          reliefUsed,
          reliefLimit: totalAllowedRelief,
          usageDate: today,
        });
      }
    } catch (err) {
      console.warn("Firestore usage fetch notice:", err.message);
      set({ isLoading: false });
    }
  },

  canStartMoodScan: () => {
    const isPremium = useSubscriptionStore.getState().isPremium;
    if (isPremium) return true;
    const { usage } = get();
    return usage.canScan;
  },

  /**
   * Atomic Mood Scan Usage Increment
   */
  recordMoodScan: async () => {
    const isPremium = useSubscriptionStore.getState().isPremium;
    if (isPremium) return true;

    const user = auth.currentUser;
    if (!user || !user.uid) return true;

    const uid = user.uid;
    const docRef = doc(db, "usage", uid);
    const today = getTodayStr();

    try {
      await setDoc(
        docRef,
        {
          uid,
          moodScansUsed: increment(1),
          usageDate: today,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Firestore scan record notice:", err.message);
    }

    // Refresh local Zustand state
    await get().fetchUsageStatus();
    return true;
  },

  canStartReliefSession: () => {
    const isPremium = useSubscriptionStore.getState().isPremium;
    if (isPremium) return true;
    const { usage } = get();
    return usage.canRelief;
  },

  /**
   * Atomic Relief Session Usage Increment
   */
  recordReliefSession: async () => {
    const isPremium = useSubscriptionStore.getState().isPremium;
    if (isPremium) return true;

    const user = auth.currentUser;
    if (!user || !user.uid) return true;

    const uid = user.uid;
    const docRef = doc(db, "usage", uid);
    const today = getTodayStr();

    try {
      await setDoc(
        docRef,
        {
          uid,
          reliefSessionsUsed: increment(1),
          usageDate: today,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Firestore relief record notice:", err.message);
    }

    await get().fetchUsageStatus();
    return true;
  },

  /**
   * Watch Rewarded Ad Increment
   */
  watchAd: async (target = "scan") => {
    const user = auth.currentUser;
    if (!user || !user.uid) return get().usage;

    const uid = user.uid;
    const docRef = doc(db, "usage", uid);

    try {
      const field = target === "relief" ? "adsWatchedRelief" : "adsWatchedScan";
      await setDoc(
        docRef,
        {
          uid,
          [field]: increment(1),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Firestore ad watch notice:", err.message);
    }

    await get().fetchUsageStatus();
    return get().usage;
  },

  /**
   * Clear local usage store on logout
   */
  resetUsageStore: () => {
    set({
      usage: {
        moodScansUsed: 0,
        reliefSessionsUsed: 0,
        adsWatchedScan: 0,
        adsWatchedRelief: 0,
        extraMoodScansUnlocked: 0,
        extraReliefUnlocked: 0,
        baseDailyScanLimit: BASE_DAILY_LIMIT,
        baseDailyReliefLimit: BASE_DAILY_LIMIT,
        totalAllowedScans: BASE_DAILY_LIMIT,
        totalAllowedRelief: BASE_DAILY_LIMIT,
        canScan: true,
        canRelief: true,
        remainingScans: BASE_DAILY_LIMIT,
        remainingRelief: BASE_DAILY_LIMIT,
        usageDate: getTodayStr(),
      },
      isLoading: false,
    });
  },
}));

export default useUsageStore;
