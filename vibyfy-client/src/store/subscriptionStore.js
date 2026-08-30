import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { auth, db } from "../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import API_URL from "../config/apiConfig";

const API_BASE_URL = `${API_URL}/api/usage`;

const useSubscriptionStore = create((set, get) => ({
  plan: localStorage.getItem("vibyfy_plan") || "free",
  isPremium: (localStorage.getItem("vibyfy_plan") || "free") === "premium",

  setPlan: (newPlan) => {
    localStorage.setItem("vibyfy_plan", newPlan);
    set({ plan: newPlan, isPremium: newPlan === "premium" });
  },

  upgradeToPremium: async () => {
    const user = auth.currentUser;
    const uid = user ? user.uid : "user_guest";

    try {
      if (user) {
        const userRef = doc(db, "users", uid);
        const usageRef = doc(db, "usage", uid);
        await setDoc(userRef, { plan: "premium", updatedAt: serverTimestamp() }, { merge: true });
        await setDoc(usageRef, { plan: "premium", updatedAt: serverTimestamp() }, { merge: true });
      }
      await axios.post(`${API_BASE_URL}/upgrade-plan`, { userId: uid, plan: "premium" });
    } catch (err) {
      console.warn("Upgrade plan notice:", err.message);
    }

    get().setPlan("premium");
    toast.success("✨ Welcome to VIBYFY Premium! Unlimited Vibe Scans Unlocked.", {
      duration: 5000,
      icon: "👑",
    });
  },

  downgradeToFree: async () => {
    const user = auth.currentUser;
    const uid = user ? user.uid : "user_guest";

    try {
      if (user) {
        const userRef = doc(db, "users", uid);
        const usageRef = doc(db, "usage", uid);
        await setDoc(userRef, { plan: "free", updatedAt: serverTimestamp() }, { merge: true });
        await setDoc(usageRef, { plan: "free", updatedAt: serverTimestamp() }, { merge: true });
      }
      await axios.post(`${API_BASE_URL}/upgrade-plan`, { userId: uid, plan: "free" });
    } catch (e) {}

    get().setPlan("free");
    toast("Switched to Free Plan (5 Scans/Day)");
  },
}));

export default useSubscriptionStore;
