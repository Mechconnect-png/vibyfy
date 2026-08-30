import {
  Trash2,
  Play,
  ListMusic,
} from "lucide-react";

import useQueueStore from "../store/queueStore";
import usePlayerStore from "../store/playerStore";

const Queue = () => {
  const {
    queue,
    removeSong,
    clearQueue,
  } = useQueueStore();

  const { playSong } = usePlayerStore();

  return (
    <div className="space-y-8 pb-24">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold">
            Queue
          </h1>

          <p className="text-slate-400">
            {queue.length} Songs
          </p>
        </div>

        <button
          onClick={clearQueue}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Clear Queue
        </button>

      </div>

      {queue.length === 0 ? (
        <div className="bg-slate-900 rounded-xl p-16 text-center">

          <ListMusic
            size={70}
            className="mx-auto text-slate-500"
          />

          <h2 className="text-2xl mt-5">
            Queue Empty
          </h2>

        </div>
      ) : (
        <div className="space-y-3">

          {queue.map((song) => (

            <div
              key={song.id}
              className="bg-slate-900 rounded-xl p-4 flex justify-between items-center"
            >

              <div
                className="flex gap-4 items-center cursor-pointer"
                onClick={() =>
                  playSong(song, queue)
                }
              >

                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                <div>

                  <h3 className="font-semibold">
                    {song.title}
                  </h3>

                  <p className="text-slate-400">
                    {song.artist}
                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    playSong(song, queue)
                  }
                >
                  <Play />
                </button>

                <button
                  onClick={() =>
                    removeSong(song.id)
                  }
                >
                  <Trash2 />
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Queue;