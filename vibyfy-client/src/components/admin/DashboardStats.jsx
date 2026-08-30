import { Music, Users, UserRound, Heart } from "lucide-react";

const DashboardStats = () => {
  const cards = [
    {
      title: "Songs",
      value: 0,
      icon: Music,
    },
    {
      title: "Users",
      value: 0,
      icon: Users,
    },
    {
      title: "Artists",
      value: 0,
      icon: UserRound,
    },
    {
      title: "Likes",
      value: 0,
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
                <p className="text-slate-400">{card.title}</p>
                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <Icon size={34} className="text-purple-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;