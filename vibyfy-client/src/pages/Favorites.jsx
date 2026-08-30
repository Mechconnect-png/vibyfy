import { useEffect, useState } from "react";
import SongCard from "../components/cards/SongCard";
import { getLikedSongs } from "../services/likeService";
import SkeletonCard from "../components/common/SkeletonCard";

const Favorites = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getLikedSongs();
      setSongs(data || []);
    } catch (err) {
      console.error("Favorite Load Error:", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-24">
        <h1 className="text-4xl font-bold text-white">❤️ Favorite Songs</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          ❤️ Favorite Songs
        </h1>
        <p className="text-slate-400 mt-2">
          {songs.length} song{songs.length !== 1 ? "s" : ""} saved in your favorites
        </p>
      </div>

      {songs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-red-500 text-3xl mb-4">
            ❤️
          </div>
          <h2 className="text-2xl font-bold text-white">No Favorite Songs Yet</h2>
          <p className="text-slate-400 mt-3 text-sm">
            Tap the heart ❤️ icon on any song card while listening to add it to your personal favorites collection!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} playlist={songs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;