import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";

export const getProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (e) {
    console.warn("Profile fetch notice:", e.message);
  }

  return {
    uid: user.uid,
    fullName: user.displayName || user.email?.split("@")[0] || "VIBYFY Listener",
    email: user.email,
    plan: "free",
    createdAt: new Date().toISOString(),
  };
};

export const updateProfile = async (updates = {}) => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, updates, { merge: true });
  } catch (e) {
    console.warn("Update profile notice:", e.message);
  }
};

export const ensureProfile = async (user, extra = {}) => {
  if (!user) return;
  const profile = await getProfile();
  if (!profile) {
    await updateProfile({
      uid: user.uid,
      fullName: extra.name || user.displayName || user.email?.split("@")[0] || "VIBYFY Listener",
      email: user.email,
      plan: "free",
      createdAt: new Date().toISOString(),
    });
  }
};

export default {
  getProfile,
  updateProfile,
  ensureProfile,
};