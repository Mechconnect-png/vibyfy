import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/usage`;

const useSubscriptionStore = create((set, get) => ({
  plan: "free",
  isPremium: false,
  isLoading: false,

  fetchPlan: async (userId = "default_user") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/status`, { params: { userId } });
      if (res.data && res.data.usage) {
        set({
          plan: res.data.usage.plan,
          isPremium: res.data.usage.isPremium,
        });
      }
    } catch (err) {
      console.warn("Failed to fetch plan:", err.message);
    }
  },

  upgradeToPremium: async (userId = "default_user") => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_BASE_URL}/upgrade-plan`, { userId, plan: "premium" });
      if (res.data && res.data.usage) {
        set({
          plan: "premium",
          isPremium: true,
        });
      }
    } catch (err) {
      console.error("Failed to upgrade to premium:", err);
      // Fallback local upgrade for smooth UX
      set({ plan: "premium", isPremium: true });
    } finally {
      set({ isLoading: false });
    }
  },

  downgradeToFree: async (userId = "default_user") => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_BASE_URL}/upgrade-plan`, { userId, plan: "free" });
      if (res.data && res.data.usage) {
        set({
          plan: "free",
          isPremium: false,
        });
      }
    } catch (err) {
      set({ plan: "free", isPremium: false });
    } finally {
      set({ isLoading: false });
    }
  },

  togglePlan: (userId = "default_user") => {
    const current = get().plan;
    if (current === "premium") {
      get().downgradeToFree(userId);
    } else {
      get().upgradeToPremium(userId);
    }
  },
}));

export default useSubscriptionStore;
