import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Play,
  Shuffle,
  Trash2,
  ArrowLeft,
  Music2,
} from "lucide-react";

import {
  getPlaylist,
  getPlaylistSongs,
  removeSongFromPlaylist,
} from "../services/playlistService";

import usePlayerStore from "../store/playerStore";

const PlaylistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { playSong } = usePlayerStore();

  const loadPlaylist = useCallback(async () => {
    try {
      setLoading(true);

      const playlistData = await getPlaylist(id);

      if (playlistData) {
        setPlaylist(playlistData);
      }

      const playlistSongs = await getPlaylistSongs(id);

      setSongs(playlistSongs || []);
    } catch (err) {
      console.error("PlaylistDetails Error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadPlaylist();
    }
  }, [id, loadPlaylist]);

  const handlePlayAll = () => {
    if (!songs.length) return;
    playSong(songs[0], songs);
  };

  const handleShuffle = () => {
    if (!songs.length) return;

    const shuffled = [...songs].sort(() => Math.random() - 0.5);

    playSong(shuffled[0], shuffled);
  };

  const handleRemove = async (songId) => {
    try {
      await removeSongFromPlaylist(id, songId);

      setSongs((prev) =>
        prev.filter((song) => song.id !== songId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading Playlist...
      </div>
    );
  }

  return (
    <div className="p-8 text-white">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="flex gap-8 mb-10">

        <div className="w-64 h-64 rounded-3xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center overflow-hidden">

          {playlist?.cover ? (
            <img
              src={playlist.cover}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music2 size={80} />
          )}

        </div>

        <div className="flex flex-col justify-end">

          <h1 className="text-5xl font-bold">
            {playlist?.name || "Playlist"}
          </h1>

          <p className="text-slate-400 mt-3">
            {playlist?.description || "No description"}
          </p>

          <p className="mt-3">
            {songs.length} Songs
          </p>

          <div className="flex gap-4 mt-6">

            <button
              onClick={handlePlayAll}
              className="bg-purple-600 px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Play size={18} />
              Play
            </button>

            <button
              onClick={handleShuffle}
              className="bg-slate-700 px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Shuffle size={18} />
              Shuffle
            </button>

          </div>

        </div>

      </div>

      {songs.length === 0 ? (
        <div className="text-center text-slate-400 py-20">
          No songs in this playlist.
        </div>
      ) : (
        <div className="space-y-3">

          {songs.map((song, index) => (

            <div
              key={song.id}
              className="flex justify-between items-center bg-slate-900 p-4 rounded-xl"
            >

              <div
                onClick={() => playSong(song, songs)}
                className="flex gap-4 items-center cursor-pointer"
              >

                <span>{index + 1}</span>

                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div>

                  <h2>{song.title}</h2>

                  <p className="text-slate-400">
                    {song.artist}
                  </p>

                </div>

              </div>

              <button
                onClick={() => handleRemove(song.id)}
              >
                <Trash2 className="text-red-500" />
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default PlaylistDetails;