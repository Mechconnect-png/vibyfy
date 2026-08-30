import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartHandshake, ArrowRight } from "lucide-react";
import { discoverByMood } from "../../services/musicDiscoveryService";
import SongCard, { SongCardSkeleton } from "../cards/SongCard";

const ReliefSection = ({ songs: propSongs }) => {
  const navigate = useNavigate();
  const [allSongs, setAllSongs] = useState(Array.isArray(propSongs) ? propSongs : []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propSongs && Array.isArray(propSongs) && propSongs.length > 0) {
      setAllSongs(propSongs);
    } else {
      let active = true;
      setLoading(true);
      discoverByMood("calm", 10, 0)
        .then((res) => {
          if (active) {
            const list = Array.isArray(res) ? res : (res?.songs || []);
            setAllSongs(list);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }
  }, [propSongs]);

  const safeSongsList = Array.isArray(allSongs) ? allSongs : [];

  return (
    <section className="space-y-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HeartHandshake size={28} className="text-teal-400" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Relief Zone Highlights
          </h2>
        </div>

        <button
          onClick={() => navigate("/relief")}
          className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition text-sm"
        >
          <span>Explore Relief Zone</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SongCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {safeSongsList.slice(0, 6).map((song, idx) => (
            <SongCard key={song.spotifyId || song.id} song={song} index={idx} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReliefSection;