import { X, HeartHandshake, Play } from "lucide-react";

const ReliefModal = ({
  open,
  mood,
  onClose,
  onStart,
}) => {
  if (!open) return null;

  let message = "";
  if (mood === "sad") {
    message = "We noticed you're feeling down. Would you like to play some comforting, uplifting Tamil music to help ease your mood?";
  } else if (mood === "angry") {
    message = "Feeling tense? Let's play soothing instrumental and relaxing tracks to help bring you back to calm.";
  } else {
    message = "Feeling stressed or overwhelmed? Transition your mind with peaceful ambient and focus melodies.";
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-[440px] max-w-full text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mx-auto text-teal-400">
          <HeartHandshake size={36} />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white">Relief Transition Suggestion</h2>
          <p className="text-slate-300 mt-3 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onStart}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg text-sm"
          >
            <Play size={16} fill="white" />
            <span>Start Relief Music</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl transition text-sm"
          >
            <X size={16} />
            <span>Not Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReliefModal;