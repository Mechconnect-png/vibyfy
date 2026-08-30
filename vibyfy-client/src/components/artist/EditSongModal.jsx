import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const EditSongModal = ({ song, onClose, onUpdated }) => {
  const [form, setForm] = useState(song);

  useEffect(() => {
    setForm(song);
  }, [song]);

  const updateSong = async () => {
    const { error } = await supabase
      .from("songs")
      .update({
        title: form.title,
        artist: form.artist,
        album: form.album,
        mood: form.mood,
      })
      .eq("id", form.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Song updated successfully 🎵");
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-[500px] max-w-[90vw]">
        <h2 className="text-2xl font-bold">Edit Song</h2>

        <input
          className="w-full p-3 rounded bg-slate-800"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="w-full p-3 rounded bg-slate-800"
          value={form.artist}
          onChange={(e) =>
            setForm({ ...form, artist: e.target.value })
          }
        />

        <input
          className="w-full p-3 rounded bg-slate-800"
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

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={updateSong}
            className="px-4 py-2 rounded bg-purple-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSongModal;