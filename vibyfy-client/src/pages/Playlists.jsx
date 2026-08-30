import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Music2,
  Loader2,
} from "lucide-react";

import { getPlaylists } from "../services/playlistService";
import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadPlaylists = async () => {
    try {
      setLoading(true);

      const data = await getPlaylists();

      setPlaylists(data || []);
    } catch (err) {
      console.error("Playlist Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  return (
    <div className="space-y-8 pb-24">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">

        <div>
          <h1 className="text-4xl font-bold">
            🎵 My Playlists
          </h1>

          <p className="text-slate-400 mt-2">
            {playlists.length} Playlist{playlists.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl"
        >
          <Plus size={18} />
          New Playlist
        </button>

      </div>

      {/* Loading */}

      {loading && (
        <div className="flex justify-center py-24">

          <Loader2
            size={40}
            className="animate-spin text-purple-500"
          />

        </div>
      )}

      {/* Empty */}

      {!loading && playlists.length === 0 && (
        <div className="bg-slate-900 rounded-3xl p-16 text-center">

          <Music2
            size={80}
            className="mx-auto text-slate-600"
          />

          <h2 className="text-3xl font-bold mt-6">
            No Playlists Yet
          </h2>

          <p className="text-slate-400 mt-3">
            Create your first playlist and start organizing your music.
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-8 bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl"
          >
            Create Playlist
          </button>

        </div>
      )}

      {/* Playlist Grid */}

      {!loading && playlists.length > 0 && (

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {playlists.map((playlist) => (

            <Link
              key={playlist.id}
              to={`/playlists/${playlist.id}`}
              className="group bg-slate-900 rounded-2xl overflow-hidden hover:bg-slate-800 transition duration-300 hover:-translate-y-2"
            >

              <div className="aspect-square bg-linear-to-br from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center">

                <Music2
                  size={70}
                  className="group-hover:scale-110 transition"
                />

              </div>

              <div className="p-5">

                <h2 className="text-lg font-bold truncate">
                  {playlist.name}
                </h2>

                <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                  {playlist.description || "My Playlist"}
                </p>

                <p className="text-xs text-slate-500 mt-4">
                  {playlist.created_at
                    ? new Date(
                        playlist.created_at
                      ).toLocaleDateString()
                    : ""}
                </p>

              </div>

            </Link>

          ))}

        </div>

      )}

      <CreatePlaylistModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={loadPlaylists}
      />

    </div>
  );
};

export default Playlists;