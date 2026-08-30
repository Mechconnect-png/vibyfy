import { useEffect, useState } from "react";
import usePlayerStore from "../../store/playerStore";
import { getLyrics } from "../../services/lyricsService";

const Lyrics = () => {
  const { currentSong } = usePlayerStore();

  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!currentSong) return;

      const data = await getLyrics(currentSong.id);

      setLyrics(data);
    };

    load();
  }, [currentSong]);

  if (!currentSong) return null;

  return (
    <div className="bg-slate-900 rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Lyrics
      </h2>

      <pre className="whitespace-pre-wrap leading-8 text-slate-300 font-sans">
        {lyrics || "Lyrics not available"}
      </pre>
    </div>
  );
};

export default Lyrics;