import { useState } from "react";
import { Monster } from "../interfaces";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid2,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon

interface MonsterSelectorProps {
  monsters: Monster[];
  onSelect: (monster: Monster | null, selectedMap: string) => void;
  onDelete: (monsterId: string) => void; // Callback to delete a monster
}

export const MonsterSelector = ({
  monsters,
  onSelect,
  onDelete,
}: MonsterSelectorProps) => {
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>("");

  const handleMonsterChange = (event: SelectChangeEvent<string>) => {
    const monster = monsters.find((m) => m.name === event.target.value);
    setSelectedMonster(monster || null);
    if (monster) {
      setSelectedMap(monster.maps[0]); // Auto-select the first map
      onSelect(monster, monster.maps[0]);
    } else {
      setSelectedMap("");
      onSelect(null, "");
    }
  };

  const handleMapChange = (event: SelectChangeEvent<string>) => {
    setSelectedMap(event.target.value as string);
    if (selectedMonster) {
      onSelect(selectedMonster, event.target.value as string);
    }
  };

  // Generate the picture path based on the monster's name
  const getPicturePath = (monsterName: string) => {
    return `/monsters/${monsterName.toLowerCase().replace(/ /g, "_")}.png`;
  };

  // Handle delete monster
  const handleDeleteMonster = () => {
    if (
      selectedMonster &&
      window.confirm("Are you sure you want to delete this monster?")
    ) {
      onDelete(selectedMonster.id); // Call the onDelete callback
      setSelectedMonster(null); // Clear the selected monster
      setSelectedMap(""); // Clear the selected map
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Monster
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Monster</InputLabel>
        <Select
          value={selectedMonster?.name || ""}
          onChange={handleMonsterChange}
          label="Monster"
        >
          <MenuItem value="">Select a monster</MenuItem>
          {monsters.map((monster) => (
            <MenuItem key={monster.id} value={monster.name}>
              {monster.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedMonster && (
        <Grid2 container spacing={2}>
          <Grid2 sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={getPicturePath(selectedMonster.name)}
              alt={selectedMonster.name}
            />
          </Grid2>
          <Grid2 sx={{ width: "100%" }}>
            <Typography variant="body1">
              Respawn Time: {selectedMonster.respawnTime}h
            </Typography>
          </Grid2>
          <Grid2 sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel>Map</InputLabel>
              <Select
                value={selectedMap}
                onChange={handleMapChange}
                label="Map"
              >
                {selectedMonster.maps.map((map) => (
                  <MenuItem key={map} value={map}>
                    {map}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          <Grid2
            sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          >
            {/* Delete Button */}
            <IconButton
              onClick={handleDeleteMonster}
              color="error"
              aria-label="delete monster"
            >
              <DeleteIcon />
            </IconButton>
          </Grid2>
        </Grid2>
      )}
    </Paper>
  );
};
