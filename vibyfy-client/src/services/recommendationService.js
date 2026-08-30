import { discoverByMood } from "./musicDiscoveryService";

export const getPersonalizedRecommendations = async (mood = "neutral", limit = 10) => {
  const res = await discoverByMood(mood, limit);
  return res.songs || [];
};