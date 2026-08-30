import { useEffect, useState } from "react";
import SongCard from "../cards/SongCard";
import { getRecommendations } from "../../services/recommendationService";

const RecommendedSection = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    const data = await getRecommendations();
    setSongs(data);
  };

  if (songs.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-6">
        🤖 Recommended For You
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
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

export default RecommendedSection;