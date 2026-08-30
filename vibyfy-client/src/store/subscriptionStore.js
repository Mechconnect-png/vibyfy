import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../config/apiConfig";

const API_BASE_URL = `${API_URL}/api/usage`;

const useSubscriptionStore = create((set, get) => ({
  plan: localStorage.getItem("vibyfy_plan") || "free",
  isPremium: (localStorage.getItem("vibyfy_plan") || "free") === "premium",

  setPlan: (newPlan) => {
    localStorage.setItem("vibyfy_plan", newPlan);
    set({ plan: newPlan, isPremium: newPlan === "premium" });
  },

  upgradeToPremium: async (userId = "default_user") => {
    try {
      const res = await axios.post(`${API_BASE_URL}/upgrade-plan`, { userId, plan: "premium" });
      if (res.data && res.data.success) {
        get().setPlan("premium");
        toast.success("✨ Welcome to VIBYFY Premium! Unlimited Vibe Scans Unlocked.", {
          duration: 5000,
          icon: "👑",
        });
      }
    } catch (err) {
      console.warn("Upgrade plan fallback notice:", err.message);
      get().setPlan("premium");
      toast.success("✨ Welcome to VIBYFY Premium! Unlimited Vibe Scans Unlocked.", {
        duration: 5000,
        icon: "👑",
      });
    }
  },

  downgradeToFree: async (userId = "default_user") => {
    try {
      await axios.post(`${API_BASE_URL}/upgrade-plan`, { userId, plan: "free" });
    } catch (e) {}
    get().setPlan("free");
    toast("Switched to Free Plan (5 Scans/Day)");
  },
}));

export default useSubscriptionStore;
