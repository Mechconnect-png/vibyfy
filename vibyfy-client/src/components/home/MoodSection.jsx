import { useNavigate } from "react-router-dom";
import { Smile, ArrowRight } from "lucide-react";
import MoodCard from "../cards/MoodCard";

const MoodSection = ({ songs = [] }) => {
  const navigate = useNavigate();
  // Create unique moods from songs
  const moods = [];

  songs.forEach((song) => {
    if (!song.mood) return;

    const moodName = song.mood.trim();

    const exists = moods.find(
      (m) => m.name.toLowerCase() === moodName.toLowerCase()
    );

    if (!exists) {
      moods.push({
        id: moodName.toLowerCase(),
        name: moodName,
        emoji: getMoodEmoji(moodName),
      });
    }
  });

  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Smile
            size={30}
            className="text-yellow-400"
          />

          <h2 className="text-2xl md:text-3xl font-bold">
            Pick Your Mood
          </h2>
        </div>

        <button
          onClick={() => navigate("/mood")}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
        >
          View All
          <ArrowRight size={18} />
        </button>

      </div>

      {moods.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-10 text-center">

          <h3 className="text-xl font-semibold">
            No Mood Categories
          </h3>

          <p className="text-slate-400 mt-2">
            Upload songs with mood information.
          </p>

        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-6
          "
        >
          {moods.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              songs={songs}
            />
          ))}
        </div>
      )}

    </section>
  );
};

// Emoji Helper
function getMoodEmoji(mood) {
  switch (mood.toLowerCase()) {
    case "happy":
      return "😊";

    case "sad":
      return "😢";

    case "romantic":
      return "❤️";

    case "party":
      return "🥳";

    case "relax":
      return "😌";

    case "relief":
      return "🌿";

    case "angry":
      return "😠";

    case "motivational":
      return "💪";

    case "devotional":
      return "🙏";

    default:
      return "🎵";
  }
}

export default MoodSection;