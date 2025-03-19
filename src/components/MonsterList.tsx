import { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { MonsterFilters } from "./MonsterFilters";
import { MonsterTable } from "./MonsterTable";
import { Sighting } from "../interfaces";

interface MonsterListProps {
  sightings: Sighting[];
  onDelete: (sightingId: string) => void;
}

export const MonsterList = ({ sightings, onDelete }: MonsterListProps) => {
  const [monsterFilter, setMonsterFilter] = useState<string>("");
  const [mapFilter, setMapFilter] = useState<string>("");
  const [channelFilter, setChannelFilter] = useState<number | "">("");

  // Format time without seconds
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Filter sightings
  const filteredSightings = sightings
    .filter((sighting) => {
      return (
        (monsterFilter === "" || sighting.monsterName === monsterFilter) &&
        (mapFilter === "" || sighting.map === mapFilter) &&
        (channelFilter === "" || sighting.channel === channelFilter)
      );
    })
    .sort(
      (a, b) =>
        a.respawnRange.earliest.toDate().getTime() -
        b.respawnRange.earliest.toDate().getTime()
    );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Monster Sightings
      </Typography>

      {/* Table */}
      <MonsterTable
        sightings={filteredSightings}
        onDelete={onDelete}
        formatTime={formatTime}
      />
      {/* Filters */}
      <MonsterFilters
        monsterFilter={monsterFilter}
        setMonsterFilter={setMonsterFilter}
        mapFilter={mapFilter}
        setMapFilter={setMapFilter}
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        sightings={sightings}
      />
    </Paper>
  );
};
