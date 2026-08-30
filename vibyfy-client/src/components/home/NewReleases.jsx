import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SongCard from "../cards/SongCard";
import { getNewReleases } from "../../services/newReleaseService";

const NewReleases = () => {
  const navigate = useNavigate();

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    const data = await getNewReleases();
    setSongs(data);
  };

  if (songs.length === 0) return null;

  return (
    <section className="space-y-6">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Sparkles className="text-cyan-400" />

          <h2 className="text-2xl md:text-3xl font-bold">
            🆕 New Releases
          </h2>

        </div>

        <button
          onClick={() => navigate("/search")}
          className="flex items-center gap-2 text-purple-400"
        >
          View All

          <ArrowRight size={18} />

        </button>

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
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            playlist={songs}
          />
        ))}
      </div>

    </section>
  );
};

export default NewReleases;