const LibraryCard = ({ item }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition cursor-pointer">
      <div className="text-5xl">{item.icon}</div>

      <h2 className="mt-5 text-xl font-bold">
        {item.title}
      </h2>

      <p className="text-slate-400 mt-2">
        {item.count}
      </p>
    </div>
  );
};

export default LibraryCard;