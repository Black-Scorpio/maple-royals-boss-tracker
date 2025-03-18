import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Grid2,
  Box,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material"; // Import Snackbar and Alert
import { MonsterSelector } from "./components/MonsterSelector";
import { MonsterList } from "./components/MonsterList";
import { ChannelSelector } from "./components/ChannelSelector";
import { useMonsters } from "./hooks/useMonsters";
import { Monster } from "./interfaces";
import {
  deleteSighting,
  recordSighting,
  clearAllSightings,
  deleteMonster,
} from "./services/firebaseService";
import { AddMonsterModal } from "./components/AddMonsterModal";

function App() {
  const { monsters, sightings } = useMonsters();
  const [channel, setChannel] = useState<number>(1);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Store unspawned channels in a nested object: { "monsterName-map": [channels] }
  const [unspawnedChannels, setUnspawnedChannels] = useState<{
    [key: string]: number[];
  }>({});

  // State for AddMonsterModal
  const [isAddMonsterModalOpen, setIsAddMonsterModalOpen] = useState(false);

  // Generate a unique key for the selected monster and map
  const getKey = (monster: Monster | null, map: string) => {
    return monster && map ? `${monster.name}-${map}` : "";
  };

  // Initialize unspawned channels when a monster and map are selected
  useEffect(() => {
    if (selectedMonster && selectedMap) {
      const key = getKey(selectedMonster, selectedMap);

      // If the key doesn't exist in the state, initialize it with all channels
      if (!unspawnedChannels[key]) {
        setUnspawnedChannels((prev) => ({
          ...prev,
          [key]: Array.from({ length: 20 }, (_, index) => index + 1), // [1, 2, ..., 20]
        }));
      }
    }
  }, [selectedMonster, selectedMap]);

  // Show snackbar notification
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSelectMonster = (monster: Monster | null, map: string) => {
    setSelectedMonster(monster);
    setSelectedMap(map);
  };

  const handleFound = async () => {
    if (!selectedMonster || !selectedMap) {
      showSnackbar("Please select a monster and map.", "error"); // Show error notification
      return;
    }

    const key = getKey(selectedMonster, selectedMap);

    try {
      // Remove the found channel from unspawned channels
      const updatedChannels = unspawnedChannels[key].filter(
        (c) => c !== channel
      );
      setUnspawnedChannels((prev) => ({
        ...prev,
        [key]: updatedChannels,
      }));

      // Record the sighting in Firestore
      await recordSighting(selectedMonster, selectedMap, channel);

      // Show success notification
      showSnackbar(
        `${selectedMonster.name} sighting recorded on ${selectedMap}, Channel ${channel}!`,
        "success"
      );
    } catch (error) {
      console.error("Error recording sighting:", error);
      showSnackbar("Error recording sighting. Please try again.", "error"); // Show error notification
    }
  };

  const handleRestart = () => {
    if (selectedMonster && selectedMap) {
      const key = getKey(selectedMonster, selectedMap);

      // Reset unspawned channels for the selected monster and map
      setUnspawnedChannels((prev) => ({
        ...prev,
        [key]: Array.from({ length: 20 }, (_, index) => index + 1), // Reset to [1, 2, ..., 20]
      }));
    }
  };

  // Get the current unspawned channels for the selected monster and map
  const currentUnspawnedChannels =
    selectedMonster && selectedMap
      ? unspawnedChannels[getKey(selectedMonster, selectedMap)] || []
      : [];

  const handleClearAllSightings = async () => {
    if (window.confirm("Are you sure you want to delete all sightings?")) {
      try {
        await clearAllSightings();
        showSnackbar("All sightings have been cleared.", "success"); // Show success notification
      } catch (error) {
        console.error("Error clearing sightings:", error);
        showSnackbar("Error clearing sightings. Please try again.", "error"); // Show error notification
      }
    }
  };

  const handleDeleteSighting = async (sightingId: string) => {
    if (window.confirm("Are you sure you want to delete this sighting?")) {
      try {
        await deleteSighting(sightingId);
        showSnackbar("Sighting deleted successfully.", "success"); // Show success notification
      } catch (error) {
        console.error("Error deleting sighting:", error);
        showSnackbar("Error deleting sighting. Please try again.", "error"); // Show error notification
      }
    }
  };

  // Handle delete monster
  const handleDeleteMonster = async (monsterId: string) => {
    try {
      await deleteMonster(monsterId);
      showSnackbar("Monster deleted successfully.", "success"); // Show success notification
    } catch (error) {
      console.error("Error deleting monster:", error);
      showSnackbar("Error deleting monster. Please try again.", "error"); // Show error notification
    }
  };

  return (
    <Box sx={{ width: "100vw" }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Monster Tracker
          </Typography>
          {/* Button to open AddMonsterModal */}
          <Button
            color="inherit"
            onClick={() => setIsAddMonsterModalOpen(true)}
          >
            Add Monster
          </Button>
          {/* Button to clear all sightings */}
          <Button color="inherit" onClick={handleClearAllSightings}>
            Clear All Sightings
          </Button>
        </Toolbar>
      </AppBar>

      {/* AddMonsterModal */}
      <AddMonsterModal
        isOpen={isAddMonsterModalOpen}
        onClose={() => setIsAddMonsterModalOpen(false)}
        onAdd={() => setIsAddMonsterModalOpen(false)} // Close the modal
      />

      {/* Main Content */}
      <Container
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "none",
        }}
      >
        <Grid2 container spacing={3}>
          {/* Monster Selector */}
          <Grid2
            sx={{
              width: {
                xs: "100%",
                md: "50%",
                alignItems: "center",
                justifyContent: "center",
              },
              p: 2,
            }}
          >
            <Paper sx={{ p: 2 }}>
              <MonsterSelector
                monsters={monsters}
                onSelect={handleSelectMonster}
                onDelete={handleDeleteMonster}
              />
            </Paper>
          </Grid2>

          {/* Flex Container for Group 1 and Group 2 */}
          <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
            {/* Group 1: Select Channel and Found Button */}
            <Grid2 container sx={{ width: "50%", p: 2 }} spacing={2}>
              <Grid2>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Select Channel
                  </Typography>
                  <ChannelSelector
                    selectedChannel={channel}
                    onSelectChannel={setChannel}
                  />
                </Paper>
              </Grid2>
              {selectedMonster && (
                <Grid2>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFound}
                    fullWidth
                  >
                    Found {selectedMonster.name} in {selectedMap}, Channel{" "}
                    {channel}
                  </Button>
                </Grid2>
              )}
            </Grid2>

            {/* Group 2: Unspawned Channels and Restart Button */}
            <Grid2 container sx={{ width: "50%", p: 2 }} spacing={2}>
              <Grid2>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Unspawned Channels
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {currentUnspawnedChannels.map((ch) => (
                      <Chip
                        key={ch}
                        label={ch}
                        size="small"
                        color="secondary"
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid2>
              <Grid2>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleRestart}
                  fullWidth
                >
                  Restart Hunting Session
                </Button>
              </Grid2>
            </Grid2>
          </Box>

          {/* Monster Sightings */}
          <Grid2 sx={{ width: "100%", p: 2 }}>
            <Paper sx={{ p: 2 }}>
              <MonsterList
                sightings={sightings}
                onDelete={handleDeleteSighting}
              />
            </Paper>
          </Grid2>
        </Grid2>
      </Container>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Auto-close after 3 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
