import { discoverByMood } from "./musicDiscoveryService";

export const getNewReleases = async (limit = 10) => {
  const res = await discoverByMood("excited", limit);
  return res.songs || [];
};