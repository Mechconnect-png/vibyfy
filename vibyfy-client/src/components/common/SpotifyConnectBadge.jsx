import React, { useEffect } from "react";
import { Headphones, CheckCircle2, LogOut } from "lucide-react";
import useSpotifyAuthStore from "../../store/spotifyAuthStore";

export const SpotifyConnectBadge = () => {
  const { playbackConnected, connectSpotifyUser, disconnectSpotifyUser, fetchUserStatus } = useSpotifyAuthStore();

  useEffect(() => {
    fetchUserStatus();
  }, [fetchUserStatus]);

  if (playbackConnected) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
        <CheckCircle2 size={14} className="text-emerald-400" />
        <span>Spotify Player Connected</span>
        <button
          onClick={disconnectSpotifyUser}
          className="ml-1 p-0.5 hover:text-red-400 transition"
          title="Disconnect Spotify Player"
        >
          <LogOut size={12} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectSpotifyUser}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition shadow-sm"
    >
      <Headphones size={14} className="text-emerald-400" />
      <span>Connect Spotify Player</span>
    </button>
  );
};

export default SpotifyConnectBadge;
