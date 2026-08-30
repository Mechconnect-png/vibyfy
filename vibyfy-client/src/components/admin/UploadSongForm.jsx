import { useState } from "react";
import {
  uploadCover,
  uploadAudio,
  saveSong,
} from "../../services/uploadService";
import toast from "react-hot-toast";

const UploadSongForm = () => {
  const [loading, setLoading] = useState(false);

  const [cover, setCover] = useState(null);
  const [audio, setAudio] = useState(null);

  const [song, setSong] = useState({
    title: "",
    artist: "",
    album: "",
    mood: "Happy",
    language: "Tamil",
  });

  const handleChange = (e) => {
    setSong({
      ...song,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async () => {
    try {
      setLoading(true);

      if (!cover || !audio) {
        toast.error("Please select cover image and audio.");
        return;
      }

      const coverUrl = await uploadCover(cover);
      const audioUrl = await uploadAudio(audio);

      await saveSong({
        ...song,
        cover_url: coverUrl,
        audio_url: audioUrl,
      });

      toast.success("Song uploaded successfully 🎵");

      setSong({
        title: "",
        artist: "",
        album: "",
        mood: "Happy",
        language: "Tamil",
      });

      setCover(null);
      setAudio(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 p-8 rounded-2xl max-w-3xl">

      <h2 className="text-3xl font-bold mb-8">
        Upload Song
      </h2>

      <div className="space-y-5">

        <input
          name="title"
          placeholder="Song Title"
          value={song.title}
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800"
        />

        <input
          name="artist"
          placeholder="Artist"
          value={song.artist}
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800"
        />

        <input
          name="album"
          placeholder="Album"
          value={song.album}
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800"
        />

        <select
          name="mood"
          value={song.mood}
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800"
        >
          <option>Happy</option>
          <option>Sad</option>
          <option>Love</option>
          <option>Relax</option>
          <option>Motivation</option>
          <option>Angry</option>
        </select>

        <select
          name="language"
          value={song.language}
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-800"
        >
          <option>Tamil</option>
          <option>Telugu</option>
          <option>Hindi</option>
          <option>English</option>
        </select>

        <div>
          <label className="block mb-2">
            Album Cover
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block mb-2">
            MP3 File
          </label>

          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700"
        >
          {loading ? "Uploading..." : "Upload Song"}
        </button>

      </div>
    </div>
  );
};

export default UploadSongForm;