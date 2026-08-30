import { discoverByMood } from "./musicDiscoveryService";

export const generateAIPlaylist = async (promptMood = "happy", count = 10) => {
  const res = await discoverByMood(promptMood, count);
  return res.songs || [];
};