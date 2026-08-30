import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditSongModal = ({ song, onClose, onUpdated }) => {
  const [form, setForm] = useState(song || {});

  useEffect(() => {
    setForm(song || {});
  }, [song]);

  const updateSong = async () => {
    toast.success("Song updated successfully 🎵");
    if (onUpdated) onUpdated();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-[500px] max-w-[90vw] space-y-4">
        <h2 className="text-2xl font-bold text-white">Edit Song</h2>

        <input
          className="w-full p-3 rounded bg-slate-800 text-white"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full p-3 rounded bg-slate-800 text-white"
          value={form.artist || ""}
          onChange={(e) => setForm({ ...form, artist: e.target.value })}
        />

        <input
          className="w-full p-3 rounded bg-slate-800 text-white"
          value={form.album || ""}
          onChange={(e) => setForm({ ...form, album: e.target.value })}
        />

        <select
          className="w-full p-3 rounded bg-slate-800 text-white"
          value={form.mood || "neutral"}
          onChange={(e) => setForm({ ...form, mood: e.target.value })}
        >
          <option value="happy">happy</option>
          <option value="sad">sad</option>
          <option value="calm">calm</option>
          <option value="energetic">energetic</option>
          <option value="relief">relief</option>
          <option value="neutral">neutral</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-600 text-white">
            Cancel
          </button>
          <button onClick={updateSong} className="px-4 py-2 rounded bg-purple-600 text-white font-bold">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSongModal;