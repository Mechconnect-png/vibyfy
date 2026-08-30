import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, Crown, LogOut, User, Sparkles, ChevronDown } from "lucide-react";
import VibyfyLogo from "../brand/VibyfyLogo";
import useMoodStore from "../../store/moodStore";
import { getMoodTheme } from "../../theme/moods";
import useAuth from "../../hooks/useAuth";

export const Navbar = ({ onOpenPremium }) => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const { lockedMood, isLocked, liveMood } = useMoodStore();
  const currentMood = isLocked ? lockedMood : liveMood;
  const moodTheme = getMoodTheme(currentMood);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.displayName || userProfile?.fullName || (user?.email ? user.email.split("@")[0] : "Listener");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between select-none">
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

        {/* AUTHENTICATED USER DROPDOWN VS LOGGED OUT BUTTONS */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                {displayName.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold leading-none">Hello,</span>
                <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">{displayName}</span>
              </div>
              <ChevronDown size={14} className="text-slate-400 ml-1" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 uppercase">
                    {userProfile?.plan || "Free Plan"}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  <User size={15} />
                  <span>My Profile</span>
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenPremium();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-slate-800 transition"
                >
                  <Crown size={15} />
                  <span>Plan / Upgrade Pro</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-800 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;