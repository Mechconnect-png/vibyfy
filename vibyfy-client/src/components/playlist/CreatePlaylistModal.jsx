import { useState } from "react";
import { X } from "lucide-react";
import { createPlaylist } from "../../services/playlistService";
import toast from "react-hot-toast";
const CreatePlaylistModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    try {
      setLoading(true);

      await createPlaylist(name, description);

      setName("");
      setDescription("");

      toast.success("Playlist created successfully! 🎉");
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-[420px] max-w-[90vw]">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Create Playlist
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Playlist Name"
            className="w-full bg-slate-800 p-3 rounded-lg"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full bg-slate-800 p-3 rounded-lg h-28"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-purple-600 rounded-lg p-3"
          >
            {loading ? "Creating..." : "Create Playlist"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreatePlaylistModal;