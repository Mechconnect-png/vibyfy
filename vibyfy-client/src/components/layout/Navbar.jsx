import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, User, ShieldCheck, Heart, Crown } from "lucide-react";
import VibyfyLogo from "../brand/VibyfyLogo";
import useMoodStore from "../../store/moodStore";
import { getMoodTheme } from "../../theme/moods";

export const Navbar = ({ onOpenPremium }) => {
  const navigate = useNavigate();
  const { lockedMood, isLocked, liveMood } = useMoodStore();
  const currentMood = isLocked ? lockedMood : liveMood;
  const moodTheme = getMoodTheme(currentMood);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo Link */}
      <Link to="/" className="flex items-center gap-2 group">
        <VibyfyLogo size="medium" showText={true} />
      </Link>

      {/* Global Vibe Indicator Badge */}
      <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1.5 text-xs font-semibold">
        <span className="text-slate-400">CURRENT VIBE:</span>
        <span className="text-white font-bold capitalize flex items-center gap-1">
          <span>{moodTheme.emoji}</span>
          <span>{currentMood}</span>
        </span>
        {isLocked && (
          <span className="ml-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            LOCKED 🔒
          </span>
        )}
      </div>

      {/* Right Navigation Actions */}
      <div className="flex items-center gap-3">
        {/* Search Quick Action */}
        <button
          onClick={() => navigate("/search")}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
          title="Search Music"
        >
          <Search size={18} />
        </button>

        {/* Favorites */}
        <Link
          to="/favorites"
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
          title="Favorites"
        >
          <Heart size={18} />
        </Link>

        {/* Premium Upgrade Button */}
        <button
          onClick={onOpenPremium}
          className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md transition"
        >
          <Crown size={15} />
          <span>VIBYFY Pro</span>
        </button>

        {/* User Profile Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            V
          </div>
          <span className="hidden sm:inline text-xs font-bold text-slate-200">Account</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;