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
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface MonsterSelectorProps {
  monsters: Monster[];
  onSelect: (monster: Monster | null, selectedMap: string) => void;
  onDelete: (monsterId: string) => void;
}

export const MonsterSelector = ({
  monsters,
  onSelect,
  onDelete,
}: MonsterSelectorProps) => {
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleFavorite = (monsterId: string) => {
    if (favorites.includes(monsterId)) {
      setFavorites(favorites.filter((id) => id !== monsterId));
    } else {
      setFavorites([...favorites, monsterId]);
    }
  };

  const handleMonsterChange = (event: SelectChangeEvent<string>) => {
    const monster = monsters.find((m) => m.name === event.target.value);
    setSelectedMonster(monster || null);
    if (monster) {
      setSelectedMap(monster.maps[0]);
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

  const getPicturePath = (monsterName: string) => {
    return `/monsters/${monsterName.toLowerCase().replace(/ /g, "_")}.png`;
  };

  const handleDeleteMonster = () => {
    if (
      selectedMonster &&
      window.confirm("Are you sure you want to delete this monster?")
    ) {
      onDelete(selectedMonster.id);
      setSelectedMonster(null);
      setSelectedMap("");
    }
  };

  const filteredMonsters = showFavoritesOnly
    ? monsters.filter((monster) => favorites.includes(monster.id))
    : monsters;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Monster
      </Typography>

      {selectedMonster && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src={getPicturePath(selectedMonster.name)}
            alt={selectedMonster.name}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      )}

      <Grid2
        container
        spacing={2}
        alignItems="center"
        sx={{ display: "flex", justifyContent: "center", mb: 2 }}
      >
        {/* Monster Selection Dropdown */}
        <Grid2>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            {" "}
            {/* Add minWidth here */}
            <InputLabel>Monster</InputLabel>
            <Select
              value={selectedMonster?.name || ""}
              onChange={handleMonsterChange}
              label="Monster"
            >
              <MenuItem value="">Select a monster</MenuItem>
              {filteredMonsters
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((monster) => (
                  <MenuItem key={monster.id} value={monster.name}>
                    {monster.name}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(monster.id);
                      }}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      {favorites.includes(monster.id) ? (
                        <StarIcon color="primary" />
                      ) : (
                        <StarBorderIcon color="primary" />
                      )}
                    </IconButton>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid2>

        {/* Show Favorites Checkbox */}
        <Grid2>
          <FormControlLabel
            control={
              <Checkbox
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                color="primary"
              />
            }
            label="Favorites"
          />
        </Grid2>

        {/* Map Dropdown */}
        <Grid2>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            {" "}
            {/* Add minWidth here */}
            <InputLabel>Map</InputLabel>
            <Select
              value={selectedMap}
              onChange={handleMapChange}
              label="Map"
              disabled={!selectedMonster}
            >
              {selectedMonster?.maps.map((map) => (
                <MenuItem key={map} value={map}>
                  {map}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={handleDeleteMonster}
            color="error"
            aria-label="delete monster"
          >
            <DeleteIcon />
          </IconButton>
        </Grid2>
      </Grid2>

      {selectedMonster && (
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2>
            <Typography variant="body1">
              Respawn Time: {selectedMonster.respawnTime}h
            </Typography>
          </Grid2>
        </Grid2>
      )}
    </Paper>
  );
};
