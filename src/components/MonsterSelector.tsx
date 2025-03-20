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
import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon
import StarIcon from "@mui/icons-material/Star"; // Import the star icon for favorites
import StarBorderIcon from "@mui/icons-material/StarBorder"; // Import the outlined star icon

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
  const [favorites, setFavorites] = useState<string[]>([]); // Track favorited monster IDs
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // Toggle for showing only favorites

  // Toggle a monster's favorite status
  const toggleFavorite = (monsterId: string) => {
    if (favorites.includes(monsterId)) {
      // Remove from favorites
      setFavorites(favorites.filter((id) => id !== monsterId));
    } else {
      // Add to favorites
      setFavorites([...favorites, monsterId]);
    }
  };

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

  // Filter monsters based on the "Show Favorites Only" checkbox
  const filteredMonsters = showFavoritesOnly
    ? monsters.filter((monster) => favorites.includes(monster.id))
    : monsters;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Monster
      </Typography>

      {/* Monster Image */}
      {selectedMonster && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img
            src={getPicturePath(selectedMonster.name)}
            alt={selectedMonster.name}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      )}

      {/* Monster Selection, Show Favorites, and Map Dropdowns */}
      <Grid2 container spacing={2} alignItems="center">
        {/* Monster Selection Dropdown */}
        <Grid2>
          <FormControl fullWidth>
            <InputLabel>Monster</InputLabel>
            <Select
              value={selectedMonster?.name || ""}
              onChange={handleMonsterChange}
              label="Monster"
            >
              <MenuItem value="">Select a monster</MenuItem>
              {filteredMonsters
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort monsters alphabetically by name
                .map((monster) => (
                  <MenuItem key={monster.id} value={monster.name}>
                    {monster.name}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the dropdown from closing
                        toggleFavorite(monster.id);
                      }}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      {favorites.includes(monster.id) ? (
                        <StarIcon color="primary" /> // Filled star for favorited monsters
                      ) : (
                        <StarBorderIcon color="primary" /> // Outlined star for non-favorited monsters
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
          <FormControl fullWidth>
            <InputLabel>Map</InputLabel>
            <Select
              value={selectedMap}
              onChange={handleMapChange}
              label="Map"
              disabled={!selectedMonster} // Disable if no monster is selected
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

      {/* Selected Monster Details */}
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
