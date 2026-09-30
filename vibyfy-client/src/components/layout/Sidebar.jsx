import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Sparkles, HeartPulse, Search, Library, Heart, History, Settings, Crown, Key } from "lucide-react";
import VibyfyLogo from "../brand/VibyfyLogo";

export const Sidebar = ({ onOpenPremium }) => {
  const mainNav = [
    { label: "Home", path: "/", icon: Home },
    { label: "AI Mood Scanner", path: "/mood", icon: Sparkles },
    { label: "Relief Zone", path: "/relief", icon: HeartPulse },
    { label: "Search & Discover", path: "/search", icon: Search },
    { label: "Your Library", path: "/library", icon: Library },
    { label: "Liked Songs", path: "/favorites", icon: Heart },
    { label: "Analytics API Keys", path: "/analytics/api-keys", icon: Key },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950/95 border-r border-slate-800/80 p-5 h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="mb-8 px-2">
        <VibyfyLogo size="large" showText={true} />
      </div>

      {/* Main Nav Links */}
      <div className="space-y-1 flex-1">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
          Navigation
        </p>

        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-bold text-sm transition ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`
              }
            >
              <Icon size={19} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Premium Upgrade Banner */}
      <div className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-pink-950/40 border border-purple-500/30 rounded-2xl p-4 text-center space-y-2 mt-auto mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto">
          <Crown size={20} />
        </div>
        <h4 className="font-bold text-white text-sm">VIBYFY Premium</h4>
        <p className="text-xs text-slate-400">
          Unlock unlimited mood journeys & custom AI scanner themes.
        </p>
        <button
          onClick={onOpenPremium}
          className="w-full mt-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition shadow-lg"
        >
          Explore Pro Tier
        </button>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-900 text-center">
        <p className="text-[11px] text-slate-500 font-medium">VIBYFY Platform v2.0</p>
        <p className="text-[10px] text-slate-600">Feel the vibe. Find your sound.</p>
      </div>
    </aside>
  );
};

export default Sidebar;