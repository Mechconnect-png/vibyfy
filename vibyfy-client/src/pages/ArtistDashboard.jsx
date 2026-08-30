import ArtistProfile from "../components/artist/ArtistProfile";
import ArtistStats from "../components/artist/ArtistStats";
import UploadSong from "../components/artist/UploadSong";
import SongList from "../components/artist/SongList";

const ArtistDashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">
        🎤 Artist Dashboard
      </h1>

      <ArtistProfile />

      <ArtistStats />

      <UploadSong />

      <SongList />
    </div>
  );
};

export default ArtistDashboard;