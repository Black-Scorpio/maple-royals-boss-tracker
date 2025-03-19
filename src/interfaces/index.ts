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

export interface MonsterFiltersProps {
  monsterFilter: string;
  setMonsterFilter: (value: string) => void;
  mapFilter: string;
  setMapFilter: (value: string) => void;
  channelFilter: number | "";
  setChannelFilter: (value: number | "") => void;
}

export interface AddMonsterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void; // Callback to close the modal
}

export interface UnspawnedChannelsProps {
  channels: number[];
  onRestart: () => void;
}

export interface SightingActionsProps {
  onFound: () => void;
  selectedMonster: { name: string } | null;
  selectedMap: string;
  channel: number;
}
