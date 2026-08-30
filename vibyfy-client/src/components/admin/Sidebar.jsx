import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Library,
  Heart,
  Brain,
  Smile,
  LayoutDashboard,
  Upload,
  Music,
  Disc,
  Users,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    // User Menu
    {
      title: "Home",
      path: "/",
      icon: Home,
    },
    {
      title: "Search",
      path: "/search",
      icon: Search,
    },
    {
      title: "Library",
      path: "/library",
      icon: Library,
    },
    {
      title: "Favorites",
      path: "/favorites",
      icon: Heart,
    },
    {
      title: "Mood",
      path: "/mood",
      icon: Brain,
    },
    {
      title: "Relief",
      path: "/relief",
      icon: Smile,
    },

    // Admin Menu
    {
      title: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Upload Song",
      path: "/artist",
      icon: Upload,
    },
    {
      title: "Songs",
      path: "/admin/songs",
      icon: Music,
    },
    {
      title: "Artists",
      path: "/admin/artists",
      icon: Disc,
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-72 h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-purple-500 mb-10">
        Moodify
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;