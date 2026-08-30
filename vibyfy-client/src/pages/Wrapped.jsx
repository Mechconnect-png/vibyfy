import { useEffect, useState } from "react";
import {
  Music,
  Clock,
  Heart,
  Mic2,
  Flame,
} from "lucide-react";

import { getWrappedStats } from "../services/wrappedService";

const Wrapped = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getWrappedStats();
    setStats(data);
  };

  if (!stats) {
    return (
      <div className="text-center py-20 text-2xl">
        Loading Wrapped...
      </div>
    );
  }

  const cards = [
    {
      title: "Minutes Listened",
      value: stats.minutes,
      icon: Clock,
      color: "from-purple-600 to-pink-500",
    },
    {
      title: "Top Song",
      value: stats.topSong,
      icon: Music,
      color: "from-blue-600 to-cyan-500",
    },
    {
      title: "Top Artist",
      value: stats.topArtist,
      icon: Mic2,
      color: "from-green-600 to-emerald-500",
    },
    {
      title: "Favorite Mood",
      value: stats.favoriteMood,
      icon: Heart,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Listening Streak",
      value: stats.streak + " Days",
      icon: Flame,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="pb-32">

      <h1 className="text-5xl font-bold mb-12">
        🎉 Moodify Wrapped
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`bg-linear-to-br ${card.color} rounded-3xl p-8 shadow-xl`}
            >
              <Icon size={45} />

              <h2 className="text-xl mt-8">
                {card.title}
              </h2>

              <p className="text-4xl font-bold mt-3">
                {card.value}
              </p>
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default Wrapped;