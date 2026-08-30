import { useEffect, useState } from "react";
import {
  getPlaylists,
  addSongToPlaylist,
  isSongInPlaylist,
} from "../../services/playlistService";
import toast from "react-hot-toast";
const AddToPlaylistModal = ({
  open,
  onClose,
  song,
}) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (open) {
      loadPlaylists();
    }
  }, [open]);

  const loadPlaylists = async () => {
    try {
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addSong = async (playlist) => {
    try {
      const exists = await isSongInPlaylist(
        playlist.id,
        song.id
      );

      if (exists) {
        toast.error("Song already exists in this playlist.");
        return;
      }

      await addSongToPlaylist(
        playlist.id,
        song.id
      );

      toast.success("Song added successfully.");

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

      <div className="bg-slate-900 w-112.5 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Add To Playlist
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto">

          {playlists.length === 0 ? (
            <p className="text-slate-400">
              No playlists available.
            </p>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => addSong(playlist)}
                className="w-full text-left bg-slate-800 hover:bg-purple-600 transition p-4 rounded-xl"
              >
                <h3 className="font-semibold">
                  {playlist.name}
                </h3>

                <p className="text-sm text-slate-400">
                  {playlist.description}
                </p>
              </button>
            ))
          )}

        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl"
        >
          Close
        </button>

      </div>

    </div>
  );
};

export default AddToPlaylistModal;