import { useState, useEffect } from "react";
import { Monster } from "../interfaces";
import {
  deleteSighting,
  saveSighting,
  clearAllSightings,
  deleteMonster,
} from "../services/firebaseService";
import { toast } from "react-toastify";

export const useMonsterTracker = () => {
  const [channel, setChannel] = useState<number>(1);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>("");
  const [unspawnedChannels, setUnspawnedChannels] = useState<{
    [key: string]: number[];
  }>({});

  const getKey = (monster: Monster | null, map: string) => {
    return monster && map ? `${monster.name}-${map}` : "";
  };

  useEffect(() => {
    if (selectedMonster && selectedMap) {
      const key = getKey(selectedMonster, selectedMap);
      if (!unspawnedChannels[key]) {
        setUnspawnedChannels((prev) => ({
          ...prev,
          [key]: Array.from({ length: 20 }, (_, index) => index + 1),
        }));
      }
    }
  }, [selectedMonster, selectedMap]);

  const handleSelectMonster = (monster: Monster | null, map: string) => {
    setSelectedMonster(monster);
    setSelectedMap(map);
  };

  const handleFound = async () => {
    if (!selectedMonster || !selectedMap) return;

    const key = getKey(selectedMonster, selectedMap);
    const updatedChannels = unspawnedChannels[key].filter((c) => c !== channel);
    setUnspawnedChannels((prev) => ({ ...prev, [key]: updatedChannels }));

    await saveSighting(selectedMonster, selectedMap, channel);
    toast.success(
      `Sighting added successfully! ${selectedMonster.name} in channel ${channel}`
    );
  };

  const handleRestart = () => {
    if (selectedMonster && selectedMap) {
      const key = getKey(selectedMonster, selectedMap);
      setUnspawnedChannels((prev) => ({
        ...prev,
        [key]: Array.from({ length: 20 }, (_, index) => index + 1),
      }));
    }
  };

  const handleClearAllSightings = async () => {
    await clearAllSightings();
  };

  const handleDeleteSighting = async (sightingId: string) => {
    await deleteSighting(sightingId);
  };

  const handleDeleteMonster = async (monsterId: string) => {
    await deleteMonster(monsterId);
  };

  return {
    channel,
    setChannel,
    selectedMonster,
    selectedMap,
    unspawnedChannels,
    handleSelectMonster,
    handleFound,
    handleRestart,
    handleClearAllSightings,
    handleDeleteSighting,
    handleDeleteMonster,
  };
};
