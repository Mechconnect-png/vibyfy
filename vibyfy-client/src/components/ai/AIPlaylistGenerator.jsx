import { useState } from "react";
import { WandSparkles } from "lucide-react";
import { generatePlaylist } from "../../services/aiPlaylistService";
import SongCard from "../cards/SongCard";

const AIPlaylistGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const result = await generatePlaylist(prompt);

    setSongs(result);

    setLoading(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-8">

      <h2 className="text-3xl font-bold mb-2">
        🤖 AI Playlist Generator
      </h2>

      <p className="text-slate-400 mb-6">
        Describe the playlist you want.
      </p>

      <div className="flex gap-4">

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Workout songs..."
          className="flex-1 bg-slate-800 rounded-xl px-5 py-4 outline-none"
        />

        <button
          onClick={handleGenerate}
          className="bg-purple-600 hover:bg-purple-700 px-6 rounded-xl flex items-center gap-2"
        >
          <WandSparkles size={18} />
          Generate
        </button>

      </div>

      {loading && (
        <div className="mt-8 text-purple-400">
          AI is creating your playlist...
        </div>
      )}

      {!loading && songs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">

          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              playlist={songs}
            />
          ))}

        </div>
      )}

      {!loading && prompt && songs.length === 0 && (
        <div className="mt-8 text-slate-400">
          No matching songs found.
        </div>
      )}
    </div>
  );
};

export default AIPlaylistGenerator;