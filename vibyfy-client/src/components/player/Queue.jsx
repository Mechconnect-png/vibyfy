import useQueueStore from "../../store/queueStore";
import usePlayerStore from "../../store/playerStore";

const Queue = () => {
  const { queue, removeFromQueue } = useQueueStore();
  const { playSong } = usePlayerStore();

  if (queue.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-6">
        Queue is empty
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        🎵 Up Next
      </h2>

      <div className="space-y-3">
        {queue.map((song) => (
          <div
            key={song.id}
            className="flex items-center justify-between bg-slate-800 rounded-lg p-3"
          >
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => playSong(song, queue)}
            >
              <img
                src={song.cover}
                className="w-14 h-14 rounded-lg object-cover"
                alt={song.title}
              />

              <div>
                <h3 className="font-semibold">
                  {song.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {song.artist}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeFromQueue(song.id)}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queue;