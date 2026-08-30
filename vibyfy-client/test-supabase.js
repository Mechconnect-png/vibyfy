import { supabase } from './src/lib/supabase.js';

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

    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

testConnection().then(success => {
  if (!success) {
    process.exit(1);
  }
});