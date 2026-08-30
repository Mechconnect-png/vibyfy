import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const ArtistCard = ({ artist }) => {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group block bg-slate-900 rounded-2xl p-5 hover:bg-slate-800 transition duration-300 hover:scale-105"
    >
      <div className="relative">

        <img
          src={
            artist.image ||
            "https://placehold.co/300x300?text=Artist"
          }
          alt={artist.name}
          className="w-full aspect-square rounded-full object-cover border-4 border-slate-800 group-hover:border-purple-500 transition"
        />

        {/* Play Button */}
        <button
          className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 p-3 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
          onClick={(e) => e.preventDefault()}
        >
          <Play
            size={18}
            fill="white"
            color="white"
          />
        </button>

      </div>

      <div className="mt-5 text-center">

        <h3 className="font-bold text-lg truncate">
          {artist.name}
        </h3>

        <p className="text-slate-400 text-sm mt-1">
          Artist
        </p>

        {artist.followers && (
          <p className="text-purple-400 text-xs mt-2">
            {artist.followers.toLocaleString()} Followers
          </p>
        )}

      </div>
    </Link>
  );
};

export default ArtistCard;