import { useState } from "react";
import { supabase } from "../../lib/supabase";
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

    if (!cover || !audio) {
      toast.error("Please select cover image and audio.");
      return;
    }

    setLoading(true);

    try {
      // Upload cover
      const coverName = `${Date.now()}-${cover.name}`;

      const { error: coverError } = await supabase.storage
        .from("covers")
        .upload(coverName, cover);

      if (coverError) throw coverError;

      const { data: coverUrl } = supabase.storage
        .from("covers")
        .getPublicUrl(coverName);

      // Upload audio
      const audioName = `${Date.now()}-${audio.name}`;

      const { error: audioError } = await supabase.storage
        .from("songs")
        .upload(audioName, audio);

      if (audioError) throw audioError;

      const { data: audioUrl } = supabase.storage
        .from("songs")
        .getPublicUrl(audioName);

      // Save metadata
      const { error } = await supabase.from("songs").insert([
        {
          title: form.title,
          artist: form.artist,
          album: form.album,
          mood: form.mood,
          cover: coverUrl.publicUrl,
          audio: audioUrl.publicUrl,
        },
      ]);

      if (error) throw error;

      toast.success("Song uploaded successfully 🎵");

      setForm({
        title: "",
        artist: "",
        album: "",
        mood: "happy",
      });

      setCover(null);
      setAudio(null);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={uploadSong}
      className="bg-slate-900 p-6 rounded-xl space-y-4"
    >
      <h2 className="text-2xl font-bold">
        Upload Song
      </h2>

      <input
        className="w-full p-3 rounded bg-slate-800"
        placeholder="Song Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <input
        className="w-full p-3 rounded bg-slate-800"
        placeholder="Artist"
        value={form.artist}
        onChange={(e) =>
          setForm({ ...form, artist: e.target.value })
        }
      />

      <input
        className="w-full p-3 rounded bg-slate-800"
        placeholder="Album"
        value={form.album}
        onChange={(e) =>
          setForm({ ...form, album: e.target.value })
        }
      />

      <select
        className="w-full p-3 rounded bg-slate-800"
        value={form.mood}
        onChange={(e) =>
          setForm({ ...form, mood: e.target.value })
        }
      >
        <option>happy</option>
        <option>sad</option>
        <option>calm</option>
        <option>energetic</option>
        <option>relief</option>
        <option>neutral</option>
      </select>

      <div>
        <label>Album Cover</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCover(e.target.files[0])}
        />
      </div>

      <div>
        <label>MP3 File</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0])}
        />
      </div>

      <button
        disabled={loading}
        className="bg-purple-600 px-6 py-3 rounded-lg"
      >
        {loading ? "Uploading..." : "Upload Song"}
      </button>
    </form>
  );
};

export default UploadSong;