import React from "react";
import { ExternalLink, Heart } from "lucide-react";
import usePlayerStore from "../../store/playerStore";
import useFavoriteStore from "../../store/favoriteStore";
import { openSpotifyTrack } from "../../services/spotifyPlaybackService";

const MiniPlayer = () => {
  const { currentSong } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  if (!currentSong) return null;

  const trackId = currentSong.spotifyId || currentSong.id;
  const favorited = isFavorite ? isFavorite(trackId) : false;

  const handleOpenSpotify = (e) => {
    e.stopPropagation();
    openSpotifyTrack(currentSong);
  };

  return (
    <div
      onClick={handleOpenSpotify}
      className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-4 md:px-8 py-3 flex items-center justify-between shadow-2xl cursor-pointer hover:bg-slate-900/90 transition select-none"
    >
      {/* Track Info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <img
          src={currentSong.image || currentSong.cover}
          alt={currentSong.title}
          className="w-12 h-12 rounded-xl object-cover shadow-md border border-slate-800 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-white text-sm md:text-base truncate">
              {currentSong.title}
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold shrink-0">
              Spotify Track
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
            {currentSong.artist} • <span className="italic">{currentSong.album}</span>
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (toggleFavorite) toggleFavorite(currentSong);
          }}
          className={`p-2 rounded-full transition ${
            favorited ? "text-red-500" : "text-slate-400 hover:text-red-400"
          }`}
        >
          <Heart size={18} className={favorited ? "fill-red-500 text-red-500" : ""} />
        </button>

        <button
          onClick={handleOpenSpotify}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-600/30"
        >
          <span>Open in Spotify</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;