import { getRecentlyPlayed } from "./historyService";

export const getContinueListening = async (limit = 6) => {
  const history = await getRecentlyPlayed(limit);
  if (history.length > 0) return history;
  
  const { discoverByMood } = await import("./musicDiscoveryService");
  const res = await discoverByMood("happy", limit);
  return res.songs || [];
};