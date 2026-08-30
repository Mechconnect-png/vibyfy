import { Play } from "lucide-react";
import usePlayerStore from "../../store/playerStore";

const DailyMixCard = ({
  song,
  playlist,
}) => {
  const { playSong } = usePlayerStore();

  return (
    <div
      className="
      bg-slate-900
      rounded-2xl
      overflow-hidden
      hover:bg-slate-800
      transition
      cursor-pointer
      group
    "
    >
      <img
        src={song.cover || song.cover_url}
        alt={song.title}
        loading="lazy"
        className="w-full aspect-square object-cover"
      />

      <div className="p-4">

        <h3 className="font-semibold truncate">
          {song.title}
        </h3>

        <p className="text-sm text-slate-400 truncate">
          {song.artist}
        </p>

        <button
          onClick={() =>
            playSong(song, playlist)
          }
          className="
            mt-4
            w-full
            bg-purple-600
            hover:bg-purple-700
            rounded-xl
            py-2
            flex
            justify-center
            items-center
            gap-2
          "
        >
          <Play size={18} />
          Play
        </button>

      </div>
    </div>
  );
};

export default DailyMixCard;