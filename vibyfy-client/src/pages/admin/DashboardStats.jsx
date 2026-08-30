import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Users,
  Music,
  UserRound,
  Heart,
} from "lucide-react";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    songs: 0,
    artists: 0,
    likes: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const { count: songCount } = await supabase
        .from("songs")
        .select("*", { count: "exact", head: true });

      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: artistCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "artist");

      setStats({
        users: userCount || 0,
        songs: songCount || 0,
        artists: artistCount || 0,
        likes: 0,
      });
    };

    loadStats();
  }, []);

  const cards = [
    {
      title: "Users",
      value: stats.users,
      icon: Users,
    },
    {
      title: "Songs",
      value: stats.songs,
      icon: Music,
    },
    {
      title: "Artists",
      value: stats.artists,
      icon: UserRound,
    },
    {
      title: "Likes",
      value: stats.likes,
      icon: Heart,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-slate-900 rounded-xl p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <Icon
                className="text-purple-500"
                size={34}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;