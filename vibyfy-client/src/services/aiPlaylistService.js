import { discoverByMood } from "./musicDiscoveryService";

export const generateSmartPlaylist = async (vibe = "calm") => {
  const res = await discoverByMood(vibe, 10);
  return {
    id: `ai-pl-${Date.now()}`,
    name: `AI Soundscape: ${vibe.toUpperCase()}`,
    songs: res.songs || [],
  };
};