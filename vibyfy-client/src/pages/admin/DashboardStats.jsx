import { useEffect, useState } from "react";
import { Users, Music, UserRound, Heart } from "lucide-react";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    users: 128,
    songs: 250,
    artists: 14,
    likes: 640,
  });

  const cards = [
    { title: "Users", value: stats.users, icon: Users },
    { title: "Songs", value: stats.songs, icon: Music },
    { title: "Artists", value: stats.artists, icon: UserRound },
    { title: "Likes", value: stats.likes, icon: Heart },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="bg-slate-900 rounded-xl p-6 select-none">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                <h2 className="text-3xl font-bold mt-2 text-white">{card.value}</h2>
              </div>
              <Icon className="text-purple-500" size={34} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;