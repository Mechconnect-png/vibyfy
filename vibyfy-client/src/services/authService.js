import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/**
 * Friendly Error Mapping for Firebase Auth Error Codes
 */
export const formatAuthError = (error) => {
  if (!error) return "An unexpected error occurred.";
  const code = error.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email address or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
};

/**
 * Firebase SignUp + Firestore User Document Creation (STEP 4)
 */
export const signUp = async (email, password, fullName) => {
  if (!email || !password) throw new Error("Email and password are required.");

  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  if (fullName) {
    try {
      await updateProfile(user, { displayName: fullName });
    } catch (e) {
      console.warn("Display name update notice:", e);
    }
  }

  // Create Firestore User Document (Collection: users, Document ID: user.uid)
  const userRef = doc(db, "users", user.uid);
  const userData = {
    uid: user.uid,
    fullName: fullName || email.split("@")[0],
    email: email.trim(),
    plan: "free",
    moodScanCount: 0,
    reliefUsageCount: 0,
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(userRef, userData, { merge: true });
  } catch (err) {
    console.warn("Firestore document creation notice:", err.message);
  }

  return { user, profile: userData };
};

/**
 * Firebase Login (STEP 5)
 */
export const signIn = async (email, password) => {
  if (!email || !password) throw new Error("Email and password are required.");
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
};

/**
 * Firebase Logout (STEP 7)
 */
export const signOut = async () => {
  await firebaseSignOut(auth);
};

/**
 * Get Current Firebase User
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Fetch & Recover Firestore User Profile Document (STEP 8)
 * Gracefully creates profile document if missing to avoid crashes.
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const user = auth.currentUser;

  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }

    // Graceful recovery for missing profile document
    const fallbackProfile = {
      uid,
      fullName: user?.displayName || user?.email?.split("@")[0] || "VIBYFY Listener",
      email: user?.email || "",
      plan: "free",
      moodScanCount: 0,
      reliefUsageCount: 0,
      createdAt: serverTimestamp(),
    };
    await setDoc(docRef, fallbackProfile, { merge: true });
    return fallbackProfile;
  } catch (e) {
    console.warn("GetUserProfile recovery notice:", e.message);
  }

  return {
    uid,
    fullName: user?.displayName || "VIBYFY Listener",
    email: user?.email || "",
    plan: "free",
    moodScanCount: 0,
    reliefUsageCount: 0,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Subscribe to Auth State Changes (STEP 6)
 */
export const subscribeToAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getUserProfile,
  subscribeToAuthState,
  formatAuthError,
};