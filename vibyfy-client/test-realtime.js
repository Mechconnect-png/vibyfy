import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
import { config } from 'dotenv';
config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Creating Supabase client with realtime: false...');
const supabase = createClient(
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

console.log('supabase.realtime:', supabase.realtime);

// Now try a simple query
async function test() {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Query successful:', data.length);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

test();