import { discoverByMood } from "./musicDiscoveryService";

export const getDailyMixes = async () => {
  const happy = await discoverByMood("happy", 5);
  const calm = await discoverByMood("calm", 5);
  const excited = await discoverByMood("excited", 5);

  return [
    { id: "mix-1", name: "Happy Energy Mix", songs: happy.songs || [] },
    { id: "mix-2", name: "Calm Waves Mix", songs: calm.songs || [] },
    { id: "mix-3", name: "Excited Hype Mix", songs: excited.songs || [] },
  ];
};