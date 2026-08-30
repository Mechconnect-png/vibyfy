import { useEffect, useState } from "react";
import { getArtistStats } from "../services/artistAnalyticsService";

const ArtistAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getArtistStats();
    setStats(data);
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">
        Artist Analytics
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl">
            🎵 Songs
          </h2>

          <p className="text-4xl font-bold mt-4">
            {stats.totalSongs}
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl">
            ▶️ Plays
          </h2>

          <p className="text-4xl font-bold mt-4">
            {stats.totalPlays}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistAnalytics;