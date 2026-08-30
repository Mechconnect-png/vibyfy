const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-slate-900 rounded-2xl p-4">
      <div className="bg-slate-800 rounded-xl h-48 w-full"></div>

      <div className="mt-4 h-5 bg-slate-800 rounded w-3/4"></div>

      <div className="mt-3 h-4 bg-slate-800 rounded w-1/2"></div>
    </div>
  );
};

export default SkeletonCard;