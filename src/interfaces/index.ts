import { Timestamp } from "firebase/firestore";

export interface Monster {
  id: string;
  name: string;
  maps: string[];
  respawnTime: number; // In hours
  picture?: string;
  spawnedChannels: number[];
}

export interface Sighting {
  id: string;
  monsterId: string;
  monsterName: string;
  channel: number;
  map: string;
  foundAt: Timestamp;
  respawnRange: {
    earliest: Timestamp;
    latest: Timestamp;
  };
}
