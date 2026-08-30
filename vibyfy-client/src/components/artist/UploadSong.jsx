import { useState } from "react";
import toast from "react-hot-toast";

const UploadSong = () => {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    mood: "happy",
  });

  const [cover, setCover] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadSong = async (e) => {
    e.preventDefault();

    if (!form.title || !form.artist) {
      toast.error("Please fill in song title and artist.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("Song registered successfully 🎵");
      setForm({ title: "", artist: "", album: "", mood: "happy" });
      setCover(null);
      setAudio(null);
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={uploadSong} className="bg-slate-900 p-6 rounded-xl space-y-4 select-none">
      <h2 className="text-2xl font-bold text-white">Upload Song</h2>

      <input
        className="w-full p-3 rounded bg-slate-800 text-white"
        placeholder="Song Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        className="w-full p-3 rounded bg-slate-800 text-white"
        placeholder="Artist"
        value={form.artist}
        onChange={(e) => setForm({ ...form, artist: e.target.value })}
      />

      <input
        className="w-full p-3 rounded bg-slate-800 text-white"
        placeholder="Album"
        value={form.album}
        onChange={(e) => setForm({ ...form, album: e.target.value })}
      />

      <select
        className="w-full p-3 rounded bg-slate-800 text-white"
        value={form.mood}
        onChange={(e) => setForm({ ...form, mood: e.target.value })}
      >
        <option value="happy">happy</option>
        <option value="sad">sad</option>
        <option value="calm">calm</option>
        <option value="energetic">energetic</option>
        <option value="relief">relief</option>
        <option value="neutral">neutral</option>
      </select>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Album Cover</label>
        <input
          type="file"
          accept="image/*"
          className="text-xs text-slate-300"
          onChange={(e) => setCover(e.target.files[0])}
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Audio File</label>
        <input
          type="file"
          accept="audio/*"
          className="text-xs text-slate-300"
          onChange={(e) => setAudio(e.target.files[0])}
        />
      </div>

      <button
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-lg text-sm transition"
      >
        {loading ? "Uploading..." : "Upload Song"}
      </button>
    </form>
  );
};

export default UploadSong;