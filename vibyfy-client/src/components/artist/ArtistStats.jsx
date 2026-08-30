const ArtistStats = () => {
  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <h2 className="text-2xl font-bold">
        Statistics
      </h2>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <h3 className="text-3xl font-bold">0</h3>
          <p>Songs</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold">0</h3>
          <p>Plays</p>
        </div>

        <div>
          <h3 className="text-3xl font-bold">0</h3>
          <p>Likes</p>
        </div>
      </div>
    </div>
  );
};

export default ArtistStats;