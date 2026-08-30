import SongCard from "../cards/SongCard";

const TrendingSongs = ({
  songs = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">
          🔥 Trending Songs
        </h2>

        <div className="text-slate-400">
          Loading songs...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          🔥 Trending Songs
        </h2>

        <p className="text-slate-400">
          {songs.length} Songs
        </p>
      </div>

      {songs.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-8 text-center text-slate-400">
          No songs uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              playlist={songs}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingSongs;