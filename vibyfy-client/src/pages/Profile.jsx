import React, { useState } from "react";
import { User, Sparkles, Heart, Crown, Shield, History, Edit3, LogOut, Check, X } from "lucide-react";
import useMoodStore from "../store/moodStore";
import useFavoriteStore from "../store/favoriteStore";
import useUsageStore from "../store/usageStore";
import useAuth from "../hooks/useAuth";
import { getMoodTheme } from "../theme/moods";
import toast from "react-hot-toast";

export const Profile = ({ onOpenPremium }) => {
  const { user, userProfile, updateUserProfile, logout } = useAuth();
  const { lockedMood, liveMood } = useMoodStore();
  const { favorites } = useFavoriteStore();
  const { usage } = useUsageStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || userProfile?.fullName || "");
  const [bioInput, setBioInput] = useState(userProfile?.bio || "");
  const [saving, setSaving] = useState(false);

  const currentMood = lockedMood || liveMood || "happy";
  const moodTheme = getMoodTheme(currentMood);

  const displayName = user?.displayName || userProfile?.fullName || (user?.email ? user.email.split("@")[0] : "Listener");
  const email = user?.email || "listener@vibyfy.app";
  const plan = userProfile?.plan || "free";
  const isPremium = plan === "premium";

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile({
        fullName: nameInput.trim(),
        bio: bioInput.trim(),
      });
      toast.success("Profile updated successfully ✨");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto select-none">
      {/* PROFILE HEADER CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[90px] opacity-20 ${moodTheme.accent}`} />

        {/* Avatar */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 p-1 shadow-xl shrink-0">
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-white font-extrabold text-3xl uppercase">
            {displayName.charAt(0)}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-black text-white">{displayName}</h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase border ${
                isPremium
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-purple-500/10 text-purple-300 border-purple-500/30"
              }`}
            >
              {isPremium ? "VIBYFY Pro 👑" : "Free Plan"}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">{email}</p>
          {userProfile?.bio && <p className="text-xs text-slate-300 italic">"{userProfile.bio}"</p>}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sparkles size={15} className="text-purple-400" />
              <span>Current Vibe: <strong className="capitalize text-white">{currentMood}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Heart size={15} className="text-red-400" />
              <span>Liked Tracks: <strong className="text-white">{favorites ? favorites.length : 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs border border-slate-700 transition"
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>

          {!isPremium && (
            <button
              onClick={onOpenPremium}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg transition"
            >
              <Crown size={15} />
              <span>Upgrade to Pro</span>
            </button>
          )}

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-4 py-2.5 rounded-2xl text-xs transition"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* EDIT PROFILE FORM MODAL */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 size={18} className="text-purple-400" /> Edit Profile Information
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bio / Tagline</label>
              <input
                type="text"
                value={bioInput}
                placeholder="Love Tamil acoustic & chill vibes..."
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg flex items-center gap-1.5"
            >
              <Check size={15} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* PER-USER USAGE QUOTA CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Today's Usage Quotas</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Personal daily usage quota for <strong className="text-purple-300">{displayName}</strong>
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Date: {usage.usageDate}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Mood Scans Stat Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">AI Mood Scans</span>
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{usage.moodScansUsed}</span>
              <span className="text-sm font-semibold text-slate-500">
                / {isPremium ? "∞" : usage.totalAllowedScans} Used Today
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                style={{
                  width: `${isPremium ? 100 : Math.min(100, (usage.moodScansUsed / Math.max(1, usage.totalAllowedScans)) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Relief Sessions Stat Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Relief Journeys</span>
              <Heart size={16} className="text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{usage.reliefSessionsUsed}</span>
              <span className="text-sm font-semibold text-slate-500">
                / {isPremium ? "∞" : usage.totalAllowedRelief} Used Today
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                style={{
                  width: `${isPremium ? 100 : Math.min(100, (usage.reliefSessionsUsed / Math.max(1, usage.totalAllowedRelief)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;