import usePlayerStore from "../../store/playerStore";

const ProgressBar = () => {
  const {
    currentTime,
    duration,
    seek,
    currentSong,
  } = usePlayerStore();

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <div className="flex items-center gap-3 w-full">

      {/* Current Time */}
      <span className="text-xs text-slate-400 w-10 text-right">
        {formatTime(currentTime)}
      </span>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        className="
          flex-1
          h-1.5
          rounded-full
          cursor-pointer
          accent-purple-600
        "
      />

      {/* Duration */}
      <span className="text-xs text-slate-400 w-10">
        {formatTime(duration)}
      </span>

    </div>
  );
};

export default ProgressBar;