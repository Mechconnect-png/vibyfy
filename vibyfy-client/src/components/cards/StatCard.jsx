const StatCard = ({ stat }) => {
  return (
    <div className="bg-slate-900 rounded-xl p-5 text-center">
      <h2 className="text-3xl font-bold text-purple-500">
        {stat.value}
      </h2>

      <p className="text-slate-400 mt-2">
        {stat.title}
      </p>
    </div>
  );
};

export default StatCard;