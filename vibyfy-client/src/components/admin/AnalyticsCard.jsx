const AnalyticsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className={`text-5xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;