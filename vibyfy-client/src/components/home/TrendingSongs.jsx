import { useEffect, useState } from "react";
import { Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SongCard from "../cards/SongCard";
import { getTrendingSongs } from "../../services/analyticsService";

const TrendingSongs = () => {
  const navigate = useNavigate();

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingSongs();
  }, []);

  const loadTrendingSongs = async () => {
    try {
      setLoading(true);

      const data = await getTrendingSongs();

      setSongs(data || []);
    } catch (err) {
      console.error("Trending Songs Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Flame className="text-orange-500" size={30} />

          <h2 className="text-2xl md:text-3xl font-bold">
            Trending Songs
          </h2>
        </div>

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-5
          "
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-2xl bg-slate-900 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Flame className="text-orange-500" size={30} />

          <h2 className="text-2xl md:text-3xl font-bold">
            🔥 Trending Now
          </h2>
        </div>

        <button
          onClick={() => navigate("/search")}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
        >
          View All
          <ArrowRight size={18} />
        </button>

      </div>

      {/* Empty State */}
      {songs.length === 0 ? (
        <div className="rounded-2xl bg-slate-900 p-10 text-center">

          <h3 className="text-xl font-semibold">
            No Trending Songs
          </h3>

          <p className="text-slate-400 mt-2">
            Play some songs to generate trending music.
          </p>

        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-5
          "
        >
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              playlist={songs}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default TrendingSongs;