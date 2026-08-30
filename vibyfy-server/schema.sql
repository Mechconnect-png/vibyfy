-- ============================================================
-- Moodify Database Schema & RLS Policies (Supabase / PostgreSQL)
-- Tagline: "Your Mood. Your Music."
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'artist', 'admin')),
    camera_opt_in BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Artists Table
CREATE TABLE IF NOT EXISTS public.artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    genres TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Albums Table
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    cover_url TEXT,
    release_date DATE,
    genre TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Songs Table
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
    album TEXT,
    album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
    genre TEXT,
    language TEXT DEFAULT 'Tamil',
    mood TEXT CHECK (mood IN ('happy', 'sad', 'angry', 'calm', 'neutral', 'excited', 'stressed')),
    relief_category TEXT,
    duration INTEGER NOT NULL, -- in seconds
    cover_url TEXT,
    audio_url TEXT NOT NULL,
    popularity INTEGER DEFAULT 0,
    release_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Playlists Table
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Playlist Songs Junction Table
CREATE TABLE IF NOT EXISTS public.playlist_songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE NOT NULL,
    song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(playlist_id, song_id)
);

-- 7. Favorites / Liked Songs Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, song_id)
);

-- 8. Recently Played Table
CREATE TABLE IF NOT EXISTS public.recently_played (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Mood Sessions (Face AI Log)
CREATE TABLE IF NOT EXISTS public.mood_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    detected_mood TEXT NOT NULL,
    confidence_score NUMERIC(5,2),
    source TEXT DEFAULT 'camera_scan' CHECK (source IN ('camera_scan', 'manual_select')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Advertisements Table
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    sponsor_name TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    banner_url TEXT,
    target_interval_sec INTEGER DEFAULT 1800,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_played ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access to songs, artists, albums, and active ads
CREATE POLICY "Public songs are viewable by everyone" ON public.songs FOR SELECT USING (true);

-- User profile privacy: read all, write own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Playlists: User can manage own playlists
CREATE POLICY "Playlists viewable by owner or if public" ON public.playlists FOR SELECT USING (is_public OR auth.uid() = user_id);
CREATE POLICY "Users can create own playlists" ON public.playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON public.playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON public.playlists FOR DELETE USING (auth.uid() = user_id);

-- Favorites: User manages own favorites
CREATE POLICY "Users view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);
