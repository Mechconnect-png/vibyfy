import { useNavigate } from "react-router-dom";
import {
  PlayCircle,
  Sparkles,
  Music2,
  ArrowRight,
} from "lucide-react";

const HeroBanner = ({ totalSongs = 0 }) => {
  const navigate = useNavigate();
  const hour = new Date().getHours();

  let greeting = "Good Evening 👋";

  if (hour < 12) greeting = "Good Morning ☀️";
  else if (hour < 17) greeting = "Good Afternoon 🌤️";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-700 via-indigo-700 to-blue-700 px-6 py-10 md:px-10 md:py-14 lg:px-14">

      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-purple-400/20 blur-3xl"></div>

      {/* Floating Music Icon */}
      <Music2
        size={170}
        className="absolute right-10 top-1/2 -translate-y-1/2 text-white/10 hidden lg:block animate-pulse"
      />

      <div className="relative z-10 max-w-3xl">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-medium text-white">

          <Sparkles size={16} />

          AI Powered Music

        </span>

        {/* Greeting */}
        <p className="mt-6 text-lg text-purple-100">
          {greeting}
        </p>

        {/* Heading */}
        <h1 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">

          Welcome to

          <span className="block text-white">
            Moodify
          </span>

        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-base md:text-lg text-purple-100 leading-8">

          Discover Tamil music that matches your mood,
          improves your day and creates the perfect
          listening experience powered by AI.

        </p>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-purple-100">

          <div>
            🎵 <strong>{totalSongs}</strong> Songs
          </div>

          <div>
            ❤️ Unlimited Streaming
          </div>

          <div>
            🤖 AI Recommendations
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={() => navigate("/library")}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-purple-700 transition hover:scale-105"
          >

            <PlayCircle size={20} />

            Start Listening

          </button>

          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 backdrop-blur-md px-6 py-3 text-white transition hover:bg-white/20"
          >

            Explore

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
};

export default HeroBanner;