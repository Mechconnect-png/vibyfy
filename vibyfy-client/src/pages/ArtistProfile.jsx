import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play, UserPlus, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

import {
  getArtist,
  getArtistSongs,
} from "../services/artistService";
import {
  followArtist,
  unfollowArtist,
  isFollowing,
  getFollowersCount,
} from "../services/followService";

import SongCard from "../components/cards/SongCard";
import usePlayerStore from "../store/playerStore";

const ArtistProfile = () => {
  const { id } = useParams();

  const { playSong } = usePlayerStore();

  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  const loadArtist = useCallback(async () => {
    try {
      const artistData = await getArtist(id);

      setArtist(artistData);

      const artistSongs = await getArtistSongs(
        artistData.name
      );

      setSongs(artistSongs);

      const [followState, count] = await Promise.all([
        isFollowing(id),
        getFollowersCount(id),
      ]);

      setFollowing(followState);
      setFollowersCount(count);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    loadArtist();
  }, [loadArtist]);

  const handleToggleFollow = async () => {
    if (followLoading) return;

    try {
      setFollowLoading(true);

      if (following) {
        await unfollowArtist(id);
        setFollowing(false);
        setFollowersCount((c) => Math.max(0, c - 1));
      } else {
        await followArtist(id);
        setFollowing(true);
        setFollowersCount((c) => c + 1);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Couldn't update follow status.");
    } finally {
      setFollowLoading(false);
    }
  };

  if (!artist) {
    return (
      <div className="text-center mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-12">

      {/* Artist Header */}

      <div className="flex gap-8 items-center">

        <img
          src={artist.image}
          alt={artist.name}
          className="w-60 h-60 rounded-full object-cover border-4 border-purple-600"
        />

        <div>

          <p className="text-purple-400 uppercase">
            Artist
          </p>

          <h1 className="text-6xl font-bold mt-2">
            {artist.name}
          </h1>

          <p className="text-slate-400 mt-4">
            {followersCount} Followers
          </p>

          <p className="text-slate-400">
            {songs.length} Songs
          </p>

          <div className="flex gap-4 mt-8">

            <button
              onClick={() =>
                songs.length &&
                playSong(songs[0], songs)
              }
              className="bg-green-500 hover:bg-green-600 rounded-full px-6 py-3 flex items-center gap-2"
            >
              <Play size={20} />
              Play All
            </button>

            <button
              onClick={handleToggleFollow}
              disabled={followLoading}
              className={`rounded-full px-6 py-3 flex items-center gap-2 transition disabled:opacity-60 ${
                following
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              {following ? (
                <UserCheck size={20} />
              ) : (
                <UserPlus size={20} />
              )}
              {following ? "Following" : "Follow"}
            </button>

          </div>

        </div>

      </div>

      {/* Biography */}

      <section>

        <h2 className="text-3xl font-bold mb-4">
          About
        </h2>

        <p className="text-slate-300 leading-8">
          {artist.bio || "Biography not available."}
        </p>

      </section>

      {/* Songs */}

      <section>

        <h2 className="text-3xl font-bold mb-6">
          Popular Songs
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">

          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              playlist={songs}
            />
          ))}

        </div>

      </section>

    </div>
  );
};

export default ArtistProfile;