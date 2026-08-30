import { Play, Clock } from "lucide-react";
import usePlayerStore from "../../store/playerStore";

const ContinueCard = ({ song, history }) => {
  const { playSong } = usePlayerStore();

  const progress =
    history?.progress ||
    history?.progress_percentage ||
    0;

  const playedAt = history?.played_at
    ? new Date(history.played_at).toLocaleDateString()
    : "Recently";

  const handleResume = () => {
    playSong(song, [song]);
  };

  return (
    <div
      className="
        bg-slate-900
        hover:bg-slate-800
        rounded-2xl
        p-5
        transition
        border
        border-slate-800
        shadow-lg
      "
    >
      {/* Cover */}
      <img
        src={song.cover || song.cover_url}
        alt={song.title}
        loading="lazy"
        className="
          w-full
          h-44
          object-cover
          rounded-xl
        "
      />

      {/* Title */}
      <h3 className="font-bold text-lg mt-4 truncate">
        {song.title}
      </h3>

      {/* Artist */}
      <p className="text-slate-400 truncate">
        {song.artist}
      </p>

      {/* Progress */}
      <div className="mt-5">

        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>{progress}% Completed</span>

          <span className="flex items-center gap-1">
            <Clock size={14} />
            {playedAt}
          </span>
        </div>

        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">

          <div
            className="bg-purple-600 h-full rounded-full"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* Resume Button */}
      <button
        onClick={handleResume}
        className="
          mt-5
          w-full
          flex
          items-center
          justify-center
          gap-2
          bg-purple-600
          hover:bg-purple-700
          rounded-xl
          py-3
          font-semibold
          transition
        "
      >
        <Play size={18} />
        Resume Listening
      </button>
    </div>
  );
};

export default ContinueCard;