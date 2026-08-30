import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useSpotifyAuthStore from "../store/spotifyAuthStore";

export const SpotifyCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fetchUserStatus = useSpotifyAuthStore((s) => s.fetchUserStatus);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error(`Spotify Authorization Denied: ${error}`);
      navigate("/");
      return;
    }

    if (code) {
      toast.loading("Authenticating Spotify Player Session...", { id: "sp-oauth" });

      axios
        .post(`${import.meta.env.VITE_API_URL}/api/spotify/callback`, { code })
        .then((res) => {
          if (res.data && res.data.userAccessToken) {
            localStorage.setItem("vibyfy_spotify_user_token", res.data.userAccessToken);
            fetchUserStatus();
            toast.success("🎉 Spotify Player Successfully Connected!", { id: "sp-oauth" });
          } else {
            toast.error("Spotify authentication failed.", { id: "sp-oauth" });
          }
          navigate("/");
        })
        .catch((err) => {
          console.error("Spotify callback error:", err);
          toast.error("Failed to authenticate Spotify account.", { id: "sp-oauth" });
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [searchParams, navigate, fetchUserStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-spin">
          🎵
        </div>
        <h2 className="text-xl font-bold text-white">Connecting Spotify Session...</h2>
        <p className="text-xs text-slate-400">Please wait while VIBYFY validates your playback token.</p>
      </div>
    </div>
  );
};

export default SpotifyCallback;
