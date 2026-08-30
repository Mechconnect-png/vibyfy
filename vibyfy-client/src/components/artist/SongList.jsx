import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2 } from "lucide-react";
import EditSongModal from "./EditSongModal";
import toast from "react-hot-toast";
const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSong, setEditingSong] = useState(null);

  const loadSongs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setSongs(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const deleteSong = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this song?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("songs")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    loadSongs();
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold">My Songs</h2>

        <p className="mt-4 text-slate-400">
          Loading songs...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            My Songs
          </h2>

          <span className="text-slate-400">
            {songs.length} Song(s)
          </span>
        </div>

        {songs.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            No songs uploaded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {song.title}
                    </h3>

                    <p className="text-gray-400">
                      {song.artist}
                    </p>

                    <div className="flex gap-2 mt-1">
                      <span className="bg-purple-600 px-2 py-1 rounded text-xs">
                        {song.mood}
                      </span>

                      <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                        {song.album}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingSong(song)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-blue-600 transition"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deleteSong(song.id)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingSong && (
        <EditSongModal
          song={editingSong}
          onClose={() => setEditingSong(null)}
          onUpdated={loadSongs}
        />
      )}
    </>
  );
};

export default SongList;