/**
 * VIBYFY Analytics — MongoDB Connection Manager
 * Connects once and exports the connection status.
 */
import mongoose from "mongoose";

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn(
      "⚠️  MONGODB_URI not set — Analytics API will use in-memory fallback store. Set MONGODB_URI in .env for persistence."
    );
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("✅ MongoDB connected for Analytics API");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.warn("⚠️  Analytics API falling back to in-memory store.");
  }
};

export const isDatabaseConnected = () => isConnected;
