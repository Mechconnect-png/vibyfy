import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Sparkles, HeartPulse, Search, Library } from "lucide-react";

export const MobileNav = () => {
  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Vibe Scanner", path: "/mood", icon: Sparkles },
    { label: "Relief Zone", path: "/relief", icon: HeartPulse },
    { label: "Search", path: "/search", icon: Search },
    { label: "Library", path: "/library", icon: Library },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition text-xs font-semibold ${
                isActive
                  ? "text-purple-400 bg-purple-500/10 border border-purple-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
