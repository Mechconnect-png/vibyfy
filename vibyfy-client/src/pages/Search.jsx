import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Music, Sparkles, User, Disc, ListMusic, AlertCircle } from "lucide-react";
import { searchMusic } from "../services/musicDiscoveryService";
import SongCard, { SongCardSkeleton } from "../components/cards/SongCard";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("track"); // track | artist | album | playlist
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQueryChange = (value) => {
    setQuery(value);
    setSearchParams(value ? { q: value } : {}, { replace: true });
  };

  const fetchResults = useCallback(async () => {
    if (!query.trim()) {
      setSongs([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await searchMusic(query.trim(), 20, 0, activeTab);
      setSongs(res.songs || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch search results from Spotify API.");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, [query, activeTab]);

  // 400-500ms Debounce Effect
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchResults();
    }, 450);

    return () => clearTimeout(delay);
  }, [fetchResults]);

  const tabs = [
    { id: "track", label: "Songs", icon: Music },
    { id: "artist", label: "Artists", icon: User },
    { id: "album", label: "Albums", icon: Disc },
    { id: "playlist", label: "Playlists", icon: ListMusic },
  ];

  return (
    <div className="pb-24 space-y-8 select-none">
      {/* Heading */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <SearchIcon className="text-purple-400" size={32} />
          <span>Spotify Search Engine</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Search over 100M+ tracks, artists, albums, and playlists on Spotify.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative max-w-2xl">
        <SearchIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search songs, artists, albums (e.g. 'Anirudh', 'AR Rahman', 'Shape of You')..."
          className="w-full bg-slate-900/90 rounded-2xl py-4 pl-14 pr-5 border border-slate-800 focus:border-purple-500 text-white outline-none text-sm transition shadow-inner"
          autoFocus
        />
      </div>

      {/* Search Type Filter Tabs */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Initial Empty State */}
      {!query && (
        <div className="text-center py-16 space-y-4 bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8">
          <Music size={64} className="mx-auto text-slate-700 animate-bounce" />
          <h2 className="text-2xl font-bold text-white">Search Music on Spotify</h2>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Type an artist, song title, or album name to search live Spotify metadata.
          </p>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          <p className="text-xs text-purple-400 font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
            <Sparkles size={14} /> Querying Spotify Backend API...
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => (
              <SongCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* API Error State */}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-300 space-y-2">
          <AlertCircle size={28} className="mx-auto text-red-400" />
          <p className="font-bold text-sm">{error}</p>
          <button
            onClick={fetchResults}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl"
          >
            Retry Search
          </button>
        </div>
      )}

      {/* Search Results Grid (At least 20 results displayed) */}
      {!loading && !error && query && songs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Spotify Results ({songs.length})
            </h2>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles size={14} /> Verified Spotify API Metadata
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {songs.map((song, idx) => (
              <SongCard key={song.spotifyId || song.id} song={song} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && query && songs.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <Music size={64} className="mx-auto text-slate-700" />
          <h2 className="text-xl font-bold text-white">No Results Found for "{query}"</h2>
          <p className="text-slate-400 text-xs">
            Try checking spelling or search with a different artist or track name.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;