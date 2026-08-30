import { useEffect, useState } from "react";
import {
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import usePlayerStore from "../store/playerStore";
import ProgressBar from "../components/player/ProgressBar";
import VolumeSlider from "../components/player/VolumeSlider";
import Lyrics from "../components/player/Lyrics";
import AudioVisualizer from "../components/player/AudioVisualizer";
import SyncedLyrics from "../components/player/SyncedLyrics";
import { likeSong, unlikeSong, isLiked } from "../services/likeService";

const Player = () => {
  const navigate = useNavigate();

  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    previousSong,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  useEffect(() => {
    if (!currentSong?.id) return;

    let active = true;
    isLiked(currentSong.id)
      .then((value) => {
        if (active) setLiked(value);
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
    };
  }, [currentSong?.id]);

  const handleToggleLike = async () => {
    if (!currentSong?.id || loadingLike) return;

    try {
      setLoadingLike(true);

      if (liked) {
        await unlikeSong(currentSong.id);
        setLiked(false);
      } else {
        await likeSong(currentSong.id);
        setLiked(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update favorites right now.");
    } finally {
      setLoadingLike(false);
    }
  };

  if (!currentSong) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">

        <h1 className="text-3xl font-bold mb-3">
          🎵 No Song Playing
        </h1>

        <p className="text-slate-400 mb-8">
          Choose a song from Home to start listening.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition"
        >
          Go Home
        </button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-950 to-black text-white">

      {/* Header */}
      <div className="flex items-center p-6">

        <button
          onClick={() => navigate(-1)}
          className="hover:text-purple-400 transition"
        >
          <ArrowLeft size={28} />
        </button>

      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-6">

        {/* Album Cover */}
        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className={`w-80 h-80 rounded-3xl shadow-2xl object-cover ${
            isPlaying ? "animate-pulse" : ""
          }`}
        />

        {/* Song Details */}
        <h1 className="mt-8 text-4xl font-bold text-center">
          {currentSong.title}
        </h1>

        <p className="text-slate-400 mt-2 text-lg">
          {currentSong.artist}
        </p>

        {/* Progress */}
        <div className="w-full max-w-2xl mt-10">
          <ProgressBar />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8 mt-10">

          <button
            onClick={toggleShuffle}
            className={`transition ${
              shuffle
                ? "text-purple-500"
                : "hover:text-purple-400"
            }`}
          >
            <Shuffle size={24} />
          </button>

          <button
            onClick={previousSong}
            className="hover:text-purple-400 transition"
          >
            <SkipBack size={32} />
          </button>

          <button
            onClick={togglePlay}
            className="bg-purple-600 hover:bg-purple-700 rounded-full p-5 shadow-xl transition"
          >
            {isPlaying ? (
              <Pause size={30} fill="white" />
            ) : (
              <Play size={30} fill="white" />
            )}
          </button>

          <button
            onClick={nextSong}
            className="hover:text-purple-400 transition"
          >
            <SkipForward size={32} />
          </button>

          <button
            onClick={toggleRepeat}
            className={`transition ${
              repeat
                ? "text-purple-500"
                : "hover:text-purple-400"
            }`}
          >
            <Repeat size={24} />
          </button>

        </div>

        {/* Bottom Controls */}
        <div className="flex items-center gap-10 mt-12">

          <button
            onClick={handleToggleLike}
            className={`transition ${
              liked ? "text-red-500" : "hover:text-red-500"
            }`}
          >
            <Heart size={28} fill={liked ? "currentColor" : "none"} />
          </button>

          <VolumeSlider />

          <AudioVisualizer />

          <SyncedLyrics />

          <Lyrics />

        </div>

      </div>

    </div>
  );
};

export default Player;