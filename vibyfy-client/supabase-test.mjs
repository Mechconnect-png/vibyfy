// Manual test for Supabase connection
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL in .env');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

// Create Supabase client with realtime disabled to avoid WebSocket issues in Node.js 20
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: false, // Disable realtime to avoid WebSocket issues
});

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