import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve('.env');
const envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
} else {
  console.error('❌ .env file not found');
  process.exit(1);
}

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL in .env');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

console.log('🔍 Environment variables loaded:');
console.log(`  URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`  Key: ${supabaseAnonKey.substring(0, 30)}...`);

// Now test Supabase connection - USE SAME CONFIG AS src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: false, // This is the key fix for Node.js 20 WebSocket issue
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