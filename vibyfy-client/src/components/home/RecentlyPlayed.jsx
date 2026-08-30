import { useEffect, useState } from "react";
import { getRecentlyPlayed } from "../../services/historyService";
import SongCard from "../cards/SongCard";

const RecentlyPlayed = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentlyPlayed();
  }, []);

  const loadRecentlyPlayed = async () => {
    const data = await getRecentlyPlayed();
    setSongs(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 animate-pulse">
        Loading Recently Played...
      </div>
    );
  }

  if (songs.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          🕒 Recently Played
        </h2>

        <button
          onClick={loadRecentlyPlayed}
          className="text-purple-400 hover:text-purple-300"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyPlayed;