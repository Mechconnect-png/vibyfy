import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/spotify`;

export const useSpotifyAuthStore = create((set, get) => ({
  discoveryConnected: true,
  playbackConnected: false,
  userAccessToken: localStorage.getItem("vibyfy_spotify_user_token") || null,
  userProfile: null,

  fetchUserStatus: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user-status`);
      if (res.data && res.data.playbackConnected) {
        set({
          playbackConnected: true,
          userAccessToken: res.data.userAccessToken,
        });
      }
    } catch (e) {
      console.warn("Spotify user status fetch notice:", e);
    }
  },

  connectSpotifyUser: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth-url`);
      if (res.data && res.data.authUrl) {
        window.location.href = res.data.authUrl;
      }
    } catch (err) {
      toast.error("Failed to generate Spotify login link");
    }
  },

  disconnectSpotifyUser: () => {
    localStorage.removeItem("vibyfy_spotify_user_token");
    set({ playbackConnected: false, userAccessToken: null, userProfile: null });
    toast.success("Disconnected Spotify User Session");
  },
}));

export default useSpotifyAuthStore;
