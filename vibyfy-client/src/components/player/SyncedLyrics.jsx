import { useEffect, useState } from "react";
import usePlayerStore from "../../store/playerStore";
import { getLyrics } from "../../services/syncedLyricsService";

const SyncedLyrics = () => {
  const { currentSong, currentTime } = usePlayerStore();

  const [lyrics, setLyrics] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!currentSong) return;

    setLyrics(getLyrics(currentSong.title));
  }, [currentSong]);

  useEffect(() => {
    if (!lyrics.length) return;

    let index = 0;

    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        index = i;
      }
    }

    setActiveIndex(index);
  }, [currentTime, lyrics]);

  if (!currentSong)
    return (
      <p className="text-slate-400">
        Play a song to see lyrics.
      </p>
    );

  return (
    <div className="bg-slate-900 rounded-2xl p-6 h-96 overflow-y-auto">

      <h2 className="text-2xl font-bold mb-6">
        Lyrics
      </h2>

      {lyrics.map((line, index) => (
        <p
          key={index}
          className={`transition-all duration-500 my-4 ${
            activeIndex === index
              ? "text-purple-500 text-2xl font-bold"
              : "text-slate-400 text-lg"
          }`}
        >
          {line.text}
        </p>
      ))}

    </div>
  );
};

export default SyncedLyrics;