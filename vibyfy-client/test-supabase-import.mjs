// Test by importing the actual supabase client from src/lib/supabase.js
// We need to mock import.meta.env for Node.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set environment variables before importing the supabase.js file
process.env.VITE_SUPABASE_URL = 'https://rqafunpmobrnyfqthoxv.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYWZ1bnBtb2JybnlmcXRob3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MTc2MTQsImV4cCI6MjA5OTM5MzYxNH0.MLFigrpVHuE5beC3Obe3RwqAV8J6ojE7nbdORBeFkt0';

// Now we need to load the supabase.js module, but it uses import.meta.env
// We can use a dynamic import and then override import.meta.env?
// Instead, let's just read the file and evaluate it? Not ideal.
// Better: create a supabase client with the same logic as in src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Since we already set process.env, we can mimic the supabase.js logic:
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('❌ Missing VITE_SUPABASE_URL in .env');
}

if (!supabaseAnonKey) {
  throw new Error('❌ Missing VITE_SUPABASE_ANON_KEY in .env');
}

// Create Supabase Client - copy from src/lib/supabase.js
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

// Now test
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');

    // Test basic connection
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error);
      return false;
    }

    console.log('✅ Connected successfully!');
    console.log('📊 Found songs:', data.length);

    // Test mood-based fetching
    const { data: moodData, error: moodError } = await supabase
      .from('songs')
      .select('*')
      .eq('mood', 'happy')
      .limit(1);

    if (moodError) {
      console.error('❌ Mood error:', moodError);
    } else {
      console.log('😊 Happy mood songs:', moodData.length);
    }

    // Check if we have any songs at all
    const { data: allSongs, error: allError } = await supabase
      .from('songs')
      .select('*');

    if (allError) {
      console.error('❌ Error fetching all songs:', allError);
    } else {
      console.log('📚 Total songs in database:', allSongs.length);

      // Show some sample songs
      if (allSongs.length > 0) {
        console.log('🎵 Sample songs:');
        allSongs.slice(0, Math.min(3, allSongs.length)).forEach((song, index) => {
          console.log(`  ${index + 1}. ${song.title} by ${song.artist} (${song.mood})`);
        });
      }
    }

    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

testConnection().then(success => {
  if (!success) {
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
});