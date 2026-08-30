import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Heart } from "lucide-react";
import { openSpotifyTrack } from "../../services/spotifyPlaybackService";
import { getMoodTheme } from "../../theme/moods";
import usePlayerStore from "../../store/playerStore";
import useFavoriteStore from "../../store/favoriteStore";

export const SongCard = ({ song, index = 0 }) => {
  const { playSong } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  if (!song) return null;

  const trackId = song.spotifyId || song.id;
  const moodTheme = getMoodTheme(song.mood);
  const favorited = isFavorite ? isFavorite(trackId) : false;

  const handleSongClick = (e) => {
    e.stopPropagation();

    // Step 24: Debug logging
    console.log("👉 STEP 24 DEBUG — CLICKED TRACK:", {
      spotifyId: trackId,
      spotifyUri: song.spotifyUri,
      title: song.title,
      artist: song.artist,
      externalUrl: song.externalUrl,
    });

    // Update playerStore with exact clicked track object
    playSong(song);

    // Delegate to centralized Spotify playback service
    openSpotifyTrack(song);
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (toggleFavorite) toggleFavorite(song);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={handleSongClick}
      className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-950/20 flex flex-col justify-between cursor-pointer select-none"
    >
      <div>
        {/* Album Artwork Container */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-950">
          <img
            src={song.image || song.cover}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay Hover Icon */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300">
              <ExternalLink size={20} className="ml-0.5" />
            </div>
          </div>

          {/* Mood Badge */}
          <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1 border ${moodTheme.badgeBg}`}>
            <span>{moodTheme.emoji}</span>
            <span className="capitalize">{song.mood}</span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/60 hover:bg-slate-950 backdrop-blur-md text-slate-300 hover:text-red-400 transition"
          >
            <Heart size={15} className={favorited ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>

        {/* Song Info */}
        <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-purple-300 transition-colors">
          {song.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">{song.artist}</p>
        
        {song.album && (
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">{song.album}</p>
        )}
      </div>

      {/* Provider Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Spotify Track</span>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-1.5 bg-emerald-600/20 group-hover:bg-emerald-600 text-emerald-300 group-hover:text-white border border-emerald-500/40 font-semibold px-3 py-1.5 rounded-xl transition text-xs shadow-md">
          <span>Open Track</span>
          <ExternalLink size={13} />
        </div>
      </div>
    </motion.div>
  );
};

export const SongCardSkeleton = () => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 animate-pulse space-y-3">
    <div className="aspect-square bg-slate-800 rounded-xl w-full" />
    <div className="h-4 bg-slate-800 rounded w-3/4" />
    <div className="h-3 bg-slate-800/60 rounded w-1/2" />
    <div className="pt-3 border-t border-slate-800 flex justify-between">
      <div className="h-4 bg-slate-800/60 rounded w-1/3" />
      <div className="h-6 bg-slate-800 rounded w-1/3" />
    </div>
  </div>
);

export default SongCard;