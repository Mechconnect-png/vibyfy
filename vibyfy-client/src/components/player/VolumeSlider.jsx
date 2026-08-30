import {
  VolumeX,
  Volume1,
  Volume2,
} from "lucide-react";

import usePlayerStore from "../../store/playerStore";
import { useRef } from "react";

const VolumeSlider = () => {
  const { volume, setVolume } = usePlayerStore();

  const previousVolume = useRef(1);

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolume.current || 1);
    } else {
      previousVolume.current = volume;
      setVolume(0);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div className="flex items-center gap-3">

      {/* Volume Icon */}
      <button
        onClick={toggleMute}
        className="hover:text-purple-500 transition"
      >
        {getVolumeIcon()}
      </button>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) =>
          setVolume(Number(e.target.value))
        }
        className="
          w-28
          md:w-36
          h-1.5
          cursor-pointer
          accent-purple-600
        "
      />

      {/* Percentage */}
      <span className="text-xs text-slate-400 w-10 text-right">
        {Math.round(volume * 100)}%
      </span>

    </div>
  );
};

export default VolumeSlider;