import usePlayerStore from "../../store/playerStore";
import toast from "react-hot-toast";
import { Sparkles, Play } from "lucide-react";

const ReliefCard = ({ relief, songs = [] }) => {
  const { playSong, setPlaylist } = usePlayerStore();

  const getMatchingSongs = () => {
    if (!songs || songs.length === 0) return [];

    const targets = (relief.moods || []).map((m) => m.toLowerCase());
    const filtered = songs.filter((song) => {
      const sMood = (song.mood || "").toLowerCase();
      const sRelief = (song.reliefCategory || "").toLowerCase();
      const sGenre = (song.genre || "").toLowerCase();

      return targets.some(
        (t) => sMood.includes(t) || sRelief.includes(t) || sGenre.includes(t)
      );
    });

    // Fall back to calm/happy tracks if zero strict matches
    if (filtered.length === 0) {
      return songs.slice(0, 4);
    }
    return filtered;
  };

  const matchingSongs = getMatchingSongs();

  const handleStart = () => {
    if (matchingSongs.length === 0) {
      toast.error(`No songs currently available for ${relief.title}.`);
      return;
    }

    setPlaylist(matchingSongs);
    playSong(matchingSongs[0], matchingSongs);
    toast.success(`Playing ${relief.title} playlist 🎵`);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between">
      <div>
        <div className="text-4xl mb-4 p-3 bg-slate-950 border border-slate-800/80 rounded-2xl w-fit">
          {relief.icon}
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          {relief.title}
        </h3>

        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
          <Sparkles size={14} className="text-teal-400" />
          <span>{matchingSongs.length} Relief tracks curated</span>
        </p>
      </div>

      <button
        onClick={handleStart}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg text-sm"
      >
        <Play size={16} fill="white" />
        <span>Start Listening</span>
      </button>
    </div>
  );
};

export default ReliefCard;