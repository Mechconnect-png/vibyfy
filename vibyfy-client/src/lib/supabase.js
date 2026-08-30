import { createClient } from "@supabase/supabase-js";

// Environment Variables with Safe Production Fallbacks
const supabaseUrl = (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || "https://placeholder.supabase.co";
const supabaseAnonKey = (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) || "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY
);

// Create Supabase Client safely (NEVER throw error on missing env variables)
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: false,
  }
);