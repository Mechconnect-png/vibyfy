import { useEffect, useState } from "react";

import DailyMixCard from "../cards/DailyMixCard";

import { getDailyMix } from "../../services/dailyMixService";

const DailyMix = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    loadMix();
  }, []);

  const loadMix = async () => {
    const data = await getDailyMix();
    setSongs(data);
  };

  if (songs.length === 0) return null;

  return (
    <section className="mt-12">

      <h2 className="text-3xl font-bold mb-6">
        🎧 Daily Mix
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">

        {songs.map((song) => (
          <DailyMixCard
            key={song.id}
            song={song}
            playlist={songs}
          />
        ))}

      </div>

    </section>
  );
};

export default DailyMix;