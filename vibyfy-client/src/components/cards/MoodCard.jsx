import useMoodStore from "../../store/moodStore";
import usePlayerStore from "../../store/playerStore";
import toast from "react-hot-toast";
const MoodCard = ({ mood, songs = [] }) => {
  const { setMood } = useMoodStore();

  const { playSong, setPlaylist } = usePlayerStore();

  const handleClick = () => {
    setMood(mood.mood);

    const filteredSongs = songs.filter(
      (song) =>
        song.mood &&
        song.mood.toLowerCase() === mood.mood.toLowerCase()
    );

    if (filteredSongs.length === 0) {
      toast.error(`No ${mood.name} songs found.`);
      return;
    }

    setPlaylist(filteredSongs);

    playSong(filteredSongs[0], filteredSongs);
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-2xl p-6 cursor-pointer hover:scale-105 transition text-white shadow-lg"
      style={{
        background: mood.color,
      }}
    >
      <div className="text-5xl text-center">
        {mood.icon}
      </div>

      <h2 className="text-center mt-4 font-bold text-xl">
        {mood.name}
      </h2>
    </div>
  );
};

export default MoodCard;