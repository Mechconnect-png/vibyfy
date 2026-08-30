import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const env = typeof import.meta !== "undefined" ? import.meta.env : {};

const firebaseConfig = {
  apiKey: env?.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: env?.VITE_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: env?.VITE_FIREBASE_PROJECT_ID || "placeholder-project-id",
  storageBucket: env?.VITE_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: env?.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// STEP 9 — Safe Startup Debug Validation
if (env?.DEV) {
  const requiredKeys = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];
  const missingKeys = requiredKeys.filter((key) => !env[key]);
  if (missingKeys.length > 0) {
    console.warn("⚠️ [VIBYFY Firebase Debug Validation] Missing Firebase env variables:", missingKeys.join(", "));
  } else {
    console.log("✅ [VIBYFY Firebase Debug Validation] All Firebase environment variables loaded successfully.");
  }
}

// Initialize Firebase App safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default { app, auth, db };
