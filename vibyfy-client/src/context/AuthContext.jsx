import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { signOut as authSignOut } from "../services/authService";
import useUsageStore from "../store/usageStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // Auto-create missing profile document
            const newProfile = {
              uid: firebaseUser.uid,
              fullName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "VIBYFY Listener",
              email: firebaseUser.email,
              plan: "free",
              bio: "",
              photoURL: firebaseUser.photoURL || null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
            await setDoc(docRef, newProfile, { merge: true });
            setUserProfile(newProfile);
          }
        } catch (e) {
          console.warn("AuthContext profile load notice:", e.message);
        }

        // Trigger per-user usage store sync
        useUsageStore.getState().fetchUsageStatus();
      } else {
        setUser(null);
        setUserProfile(null);
        useUsageStore.getState().resetUsageStore();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Update Profile Name & Bio (Syncs to Firebase Auth + Firestore)
   */
  const updateUserProfile = async ({ fullName, bio, photoURL }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (fullName) {
      await firebaseUpdateProfile(currentUser, { displayName: fullName, photoURL: photoURL || currentUser.photoURL });
    }

    const docRef = doc(db, "users", currentUser.uid);
    const updates = {
      updatedAt: serverTimestamp(),
    };
    if (fullName) updates.fullName = fullName;
    if (bio !== undefined) updates.bio = bio;
    if (photoURL) updates.photoURL = photoURL;

    await setDoc(docRef, updates, { merge: true });

    setUser({ ...currentUser, displayName: fullName || currentUser.displayName });
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Logout Function
   */
  const logout = async () => {
    await authSignOut();
    setUser(null);
    setUserProfile(null);
    useUsageStore.getState().resetUsageStore();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};