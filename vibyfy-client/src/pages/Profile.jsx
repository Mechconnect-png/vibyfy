import React from "react";
import { User, Sparkles, Heart, Crown, Shield, Settings, History } from "lucide-react";
import useMoodStore from "../store/moodStore";
import useFavoriteStore from "../store/favoriteStore";
import { getMoodTheme } from "../theme/moods";

export const Profile = ({ onOpenPremium }) => {
  const { lockedMood, liveMood } = useMoodStore();
  const { favorites } = useFavoriteStore();
  const currentMood = lockedMood || liveMood || "happy";
  const moodTheme = getMoodTheme(currentMood);

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto">
      {/* PROFILE HEADER CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[90px] opacity-20 ${moodTheme.accent}`} />

        {/* Avatar */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 p-1 shadow-xl shrink-0">
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-white font-extrabold text-3xl">
            V
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-black text-white">Vibyfy Listener</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              Free Tier
            </span>
          </div>

          <p className="text-xs text-slate-400">listener@vibyfy.app</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sparkles size={15} className="text-purple-400" />
              <span>Favorite Vibe: <strong className="capitalize text-white">{currentMood}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Heart size={15} className="text-red-400" />
              <span>Liked Tracks: <strong className="text-white">{favorites ? favorites.length : 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Upgrade Action */}
        <button
          onClick={onOpenPremium}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs shadow-lg flex items-center gap-2 transition"
        >
          <Crown size={16} />
          <span>Upgrade to Pro</span>
        </button>
      </div>

      {/* STATS & SETTINGS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Saved Discoveries & History */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <History size={20} className="text-purple-400" />
            <h3>Recent Vibe Scans</h3>
          </div>

          <div className="space-y-2">
            {[
              { mood: "sad", conf: 88, time: "2 hours ago" },
              { mood: "calm", conf: 94, time: "Yesterday" },
              { mood: "happy", conf: 91, time: "3 days ago" },
            ].map((sc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="capitalize font-bold text-white">{sc.mood}</span>
                  <span className="text-slate-500">({sc.conf}% conf)</span>
                </div>
                <span className="text-slate-400 text-[11px]">{sc.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Account Settings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Shield size={20} className="text-emerald-400" />
            <h3>Privacy & AI Preferences</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div>
                <p className="font-semibold text-white">Local Camera Processing Only</p>
                <p className="text-[11px] text-slate-400">Zero facial images are saved or uploaded</p>
              </div>
              <span className="text-emerald-400 font-bold">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div>
                <p className="font-semibold text-white">Automatic Mood Lock</p>
                <p className="text-[11px] text-slate-400">Halt scanner automatically when stable</p>
              </div>
              <span className="text-emerald-400 font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;