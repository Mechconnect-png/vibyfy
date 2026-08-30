import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Music, Sparkles } from "lucide-react";
import { searchMusic } from "../services/musicDiscoveryService";
import SongCard, { SongCardSkeleton } from "../components/cards/SongCard";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (value) => {
    setQuery(value);
    setSearchParams(value ? { q: value } : {}, { replace: true });
  };

  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }

    try {
      setLoading(true);
      const data = await searchMusic(query);
      setSongs(data || []);
    } catch (err) {
      console.error("Search error:", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchResults();
    }, 400);

    return () => clearTimeout(delay);
  }, [fetchResults]);

  return (
    <div className="pb-24 space-y-8">
      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <SearchIcon className="text-purple-400" size={32} />
          <span>Spotify Search Engine</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Discover songs, artists, and albums directly via backend Spotify API.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative max-w-2xl">
        <SearchIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search Tamil songs, artists, or moods on Spotify..."
          className="w-full bg-slate-900/90 rounded-2xl py-4 pl-14 pr-5 border border-slate-800 focus:border-purple-500 text-white outline-none text-sm transition shadow-inner"
        />
      </div>

      {/* Initial Empty State */}
      {!query && (
        <div className="text-center py-16 space-y-4 bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8">
          <Music size={64} className="mx-auto text-slate-700" />
          <h2 className="text-2xl font-bold text-white">Search Music on Spotify</h2>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Type an artist, song title, or vibe (e.g. "Anirudh", "Melody", "Naa Ready")
          </p>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          <p className="text-xs text-purple-400 font-bold uppercase tracking-widest animate-pulse">
            Querying Spotify Backend...
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SongCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && query && songs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Spotify Search Results ({songs.length})
            </h2>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles size={14} /> Verified Spotify API Data
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {songs.map((song, idx) => (
              <SongCard key={song.spotifyId || song.id} song={song} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && query && songs.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <Music size={64} className="mx-auto text-slate-700" />
          <h2 className="text-xl font-bold text-white">No Tracks Found</h2>
          <p className="text-slate-400 text-xs">
            Try searching with another keyword or artist name.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;