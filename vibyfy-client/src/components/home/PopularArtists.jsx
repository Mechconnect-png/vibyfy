import { useNavigate } from "react-router-dom";
import { Mic2, ArrowRight } from "lucide-react";
import ArtistCard from "../cards/ArtistCard";

const PopularArtists = ({ songs = [] }) => {
  const navigate = useNavigate();
  // Create unique artist list from songs
  const artists = [];

  songs.forEach((song) => {
    const exists = artists.find(
      (artist) => artist.name === song.artist
    );

    if (!exists) {
      artists.push({
        id: song.artist,
        name: song.artist,
        image:
          song.cover ||
          "https://placehold.co/300x300?text=Artist",
      });
    }
  });

  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <Mic2
            size={30}
            className="text-pink-500"
          />

          <h2 className="text-2xl md:text-3xl font-bold">
            Popular Artists
          </h2>

        </div>

        <button
          onClick={() => navigate("/search")}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
        >

          View All

          <ArrowRight size={18} />

        </button>

      </div>

      {/* Empty */}
      {artists.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl p-10 text-center">

          <h3 className="text-xl font-semibold">
            No Artists Available
          </h3>

          <p className="text-slate-400 mt-2">
            Upload songs to populate artists.
          </p>

        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-6
          "
        >
          {artists.slice(0, 12).map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default PopularArtists;