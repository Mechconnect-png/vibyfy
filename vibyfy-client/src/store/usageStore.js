import { create } from "zustand";
import axios from "axios";
import useSubscriptionStore from "./subscriptionStore";
import API_URL from "../config/apiConfig";

const API_BASE_URL = `${API_URL}/api/usage`;
const BASE_DAILY_LIMIT = 5;

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
  },
  isLoading: false,

  fetchUsageStatus: async (userId = "default_user") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/status`, { params: { userId } });
      if (res.data && res.data.usage) {
        set({ usage: res.data.usage });
      }
    } catch (err) {
      console.warn("Usage status notice:", err.message);
    }
  },

  canStartMoodScan: () => {
    const isPremium = useSubscriptionStore.getState().isPremium;
    if (isPremium) return true;
    const { usage } = get();
    return usage.canScan;
  },

  recordMoodScan: async (userId = "default_user") => {
    const isPremium = useSubscriptionStore.getState().isPremium;
    if (isPremium) return true;

    try {
      const res = await axios.post(`${API_BASE_URL}/scan`, { userId });
      if (res.data && res.data.usage) {
        set({ usage: res.data.usage });
        return true;
      }
    } catch (err) {
      console.warn("Scan record fallback:", err.message);
      set((state) => {
        const scansUsed = state.usage.moodScansUsed + 1;
        const canScan = scansUsed < state.usage.totalAllowedScans;
        return {
          usage: {
            ...state.usage,
            moodScansUsed: scansUsed,
            canScan,
            remainingScans: Math.max(0, state.usage.totalAllowedScans - scansUsed),
          },
        };
      });
    }
    return true;
  },

  canStartReliefSession: () => {
    const isPremium = useSubscriptionStore.getState().isPremium;
    if (isPremium) return true;
    const { usage } = get();
    return usage.canRelief;
  },

  recordReliefSession: async (userId = "default_user") => {
    const isPremium = useSubscriptionStore.getState().isPremium;
    if (isPremium) return true;

    try {
      const res = await axios.post(`${API_BASE_URL}/relief`, { userId });
      if (res.data && res.data.usage) {
        set({ usage: res.data.usage });
        return true;
      }
    } catch (err) {
      set((state) => {
        const reliefUsed = state.usage.reliefSessionsUsed + 1;
        const canRelief = reliefUsed < state.usage.totalAllowedRelief;
        return {
          usage: {
            ...state.usage,
            reliefSessionsUsed: reliefUsed,
            canRelief,
            remainingRelief: Math.max(0, state.usage.totalAllowedRelief - reliefUsed),
          },
        };
      });
    }
    return true;
  },

  watchAd: async (target = "scan", userId = "default_user") => {
    try {
      const res = await axios.post(`${API_BASE_URL}/watch-ad`, { userId, target });
      if (res.data && res.data.usage) {
        set({ usage: res.data.usage });
        return res.data.usage;
      }
    } catch (err) {
      console.warn("Ad record fallback:", err.message);
      set((state) => {
        const u = { ...state.usage };
        if (target === "relief") {
          u.adsWatchedRelief += 1;
          u.extraReliefUnlocked = Math.floor(u.adsWatchedRelief / 2);
          u.totalAllowedRelief = u.baseDailyReliefLimit + u.extraReliefUnlocked;
          u.canRelief = u.reliefSessionsUsed < u.totalAllowedRelief;
        } else {
          u.adsWatchedScan += 1;
          u.extraMoodScansUnlocked = Math.floor(u.adsWatchedScan / 2);
          u.totalAllowedScans = u.baseDailyScanLimit + u.extraMoodScansUnlocked;
          u.canScan = u.moodScansUsed < u.totalAllowedScans;
        }
        return { usage: u };
      });
    }
    return get().usage;
  },
}));

export default useUsageStore;
