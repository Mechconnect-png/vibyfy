import { searchMusic } from "./musicDiscoveryService";

export const searchAll = async (query) => {
  if (!query || !query.trim()) return [];
  return await searchMusic(query.trim());
};