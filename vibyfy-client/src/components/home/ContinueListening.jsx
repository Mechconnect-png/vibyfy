import { useEffect, useState } from "react";
import ContinueCard from "../cards/ContinueCard";

import { getContinueListening } from "../../services/continueListeningService";

const ContinueListening = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContinueListening();
  }, []);

  const loadContinueListening = async () => {
    try {
      const data = await getContinueListening();
      setSongs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mt-10">
        <h2 className="text-3xl font-bold mb-6">
          🎧 Continue Listening
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-2xl bg-slate-900 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (songs.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="text-3xl font-bold mb-6">
        🎧 Continue Listening
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {songs.map((item) => (
          <ContinueCard
            key={item.id}
            song={item.songs}
            history={item}
          />
        ))}
      </div>
    </section>
  );
};

export default ContinueListening;