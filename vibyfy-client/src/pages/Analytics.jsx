import { useEffect, useState } from "react";
import {
  Music2,
  Heart,
  Users,
  ListMusic,
  PlayCircle,
} from "lucide-react";

import AnalyticsCard from "../components/admin/AnalyticsCard";

import {
  getTotalSongs,
  getTotalUsers,
  getTotalPlaylists,
  getTotalFavorites,
  getTotalPlays,
  getTopSongs,
  getTopArtists,
  getTopGenres,
  getMoodAnalytics,
} from "../services/analyticsService";

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    songs: 0,
    users: 0,
    playlists: 0,
    favorites: 0,
    plays: 0,
  });

  const [topSongs, setTopSongs] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [
        songs,
        users,
        playlists,
        favorites,
        plays,
        songsList,
        artistsList,
        genresList,
        moodList,
      ] = await Promise.all([
        getTotalSongs(),
        getTotalUsers(),
        getTotalPlaylists(),
        getTotalFavorites(),
        getTotalPlays(),
        getTopSongs(),
        getTopArtists(),
        getTopGenres(),
        getMoodAnalytics(),
      ]);

      setStats({
        songs,
        users,
        playlists,
        favorites,
        plays,
      });

      setTopSongs(songsList);
      setTopArtists(artistsList);
      setTopGenres(genresList);
      setMoods(moodList);
    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24">

      <div>
        <h1 className="text-4xl font-bold">
          📊 Analytics Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Live statistics from Moodify
        </p>
      </div>

      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <AnalyticsCard
          title="Songs"
          value={stats.songs}
          icon={<Music2 />}
          color="text-purple-500"
        />

        <AnalyticsCard
          title="Plays"
          value={stats.plays}
          icon={<PlayCircle />}
          color="text-green-500"
        />

        <AnalyticsCard
          title="Favorites"
          value={stats.favorites}
          icon={<Heart />}
          color="text-red-500"
        />

        <AnalyticsCard
          title="Users"
          value={stats.users}
          icon={<Users />}
          color="text-blue-500"
        />

        <AnalyticsCard
          title="Playlists"
          value={stats.playlists}
          icon={<ListMusic />}
          color="text-cyan-500"
        />

      </div>

      {/* Top Songs */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          🎵 Top Songs
        </h2>

        {topSongs.length === 0 ? (
          <p className="text-slate-400">
            No data available.
          </p>
        ) : (
          topSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex justify-between py-2 border-b border-slate-800"
            >
              <span>
                {index + 1}. {song.title}
              </span>

              <span>{song.plays} Plays</span>
            </div>
          ))
        )}

      </div>

      {/* Top Artists */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          🎤 Top Artists
        </h2>

        {topArtists.length === 0 ? (
          <p className="text-slate-400">
            No data available.
          </p>
        ) : (
          topArtists.map((artist, index) => (
            <div
              key={artist.artist}
              className="flex justify-between py-2 border-b border-slate-800"
            >
              <span>
                {index + 1}. {artist.artist}
              </span>

              <span>{artist.plays} Plays</span>
            </div>
          ))
        )}

      </div>

      {/* Top Genres */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          🎼 Top Genres
        </h2>

        {topGenres.length === 0 ? (
          <p className="text-slate-400">
            No data available.
          </p>
        ) : (
          topGenres.map((genre) => (
            <div
              key={genre.genre}
              className="flex justify-between py-2 border-b border-slate-800"
            >
              <span>{genre.genre}</span>

              <span>{genre.plays}</span>
            </div>
          ))
        )}

      </div>

      {/* Mood Analytics */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          😊 Mood Analytics
        </h2>

        {moods.length === 0 ? (
          <p className="text-slate-400">
            No mood data available.
          </p>
        ) : (
          moods.map((item) => (
            <div
              key={item.mood}
              className="flex justify-between py-2 border-b border-slate-800"
            >
              <span>{item.mood}</span>

              <span>{item.count}</span>
            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default Analytics;