import React, { useEffect, useState } from "react";
import useMoodStore from "../../store/moodStore";
import SongCard, { SongCardSkeleton } from "../cards/SongCard";
import { discoverByMood } from "../../services/musicDiscoveryService";
import { Sparkles } from "lucide-react";
import { getMoodTheme } from "../../theme/moods";

const AIRecommendations = ({ songs: propSongs }) => {
  const { lockedMood, liveMood } = useMoodStore();
  const [songs, setSongs] = useState(Array.isArray(propSongs) ? propSongs : []);
  const [loading, setLoading] = useState(false);

  const activeMood = (lockedMood || liveMood || "neutral").toLowerCase();
  const activeTheme = getMoodTheme(activeMood);

  useEffect(() => {
    if (propSongs && Array.isArray(propSongs) && propSongs.length > 0) {
      setSongs(propSongs);
    } else {
      let active = true;
      setLoading(true);

      discoverByMood(activeMood, 10, 0)
        .then((res) => {
          if (active) {
            const list = Array.isArray(res) ? res : (res?.songs || []);
            setSongs(list);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }
  }, [activeMood, propSongs]);

  const safeSongsList = Array.isArray(songs) ? songs : [];

  return (
    <section className="space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Sparkles className="text-purple-400" size={24} />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Spotify Mood Recommendations
            </h2>
          </div>

          <p className="text-slate-400 mt-2 text-sm md:text-base">
            {activeTheme.emoji} Personalized for your mood:{" "}
            <span className="text-purple-300 font-bold capitalize bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30 inline-block ml-1">
              {activeMood}
            </span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <SongCardSkeleton key={i} />
          ))}
        </div>
      ) : safeSongsList.length === 0 ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-10 text-center space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-purple-400 text-xl">
            🎵
          </div>
          <h3 className="text-lg font-bold text-white">No Tracks Found</h3>
          <p className="text-xs text-slate-400">
            Current target: <strong className="text-purple-300 capitalize">{activeMood}</strong>. Try selecting another mood.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {safeSongsList.map((song, idx) => (
            <SongCard key={song.spotifyId || song.id} song={song} index={idx} />
          ))}
        </div>
      )}
    </section>
  );
};

export default AIRecommendations;