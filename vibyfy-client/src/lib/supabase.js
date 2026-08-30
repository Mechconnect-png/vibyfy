import { createClient } from "@supabase/supabase-js";

// Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Environment Variables
if (!supabaseUrl) {
  throw new Error(
    "❌ Missing VITE_SUPABASE_URL in .env"
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "❌ Missing VITE_SUPABASE_ANON_KEY in .env"
  );
}

// Create Supabase Client
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