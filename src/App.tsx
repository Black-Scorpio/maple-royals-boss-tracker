import { useState } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid2,
  Paper,
} from "@mui/material";
import { MonsterSelector } from "./components/MonsterSelector";
import { MonsterList } from "./components/MonsterList";
import { ChannelSelector } from "./components/ChannelSelector";
import { useMonsterTracker } from "./hooks/useMonsterTracker";
import { AddMonsterModal } from "./components/AddMonsterModal";
import { AddSightingModal } from "./components/AddSightingModal"; // Import the new modal
import { UnspawnedChannels } from "./components/UnspawnedChannels";
import { SightingActions } from "./components/SightingActions";
import { useMonsters } from "./hooks/useMonsters";
import { ToastContainer } from "react-toastify";

function App() {
  const { monsters, sightings } = useMonsters();
  const {
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
  } = useMonsterTracker();

  const [isAddMonsterModalOpen, setIsAddMonsterModalOpen] = useState(false);
  const [isAddSightingModalOpen, setIsAddSightingModalOpen] = useState(false); // State for AddSightingModal

  const currentUnspawnedChannels =
    selectedMonster && selectedMap
      ? (
          unspawnedChannels[`${selectedMonster.name}-${selectedMap}`] || []
        ).filter((channel) => {
          const sighting = sightings.find(
            (s) =>
              s.monsterId === selectedMonster.id &&
              s.map === selectedMap &&
              s.channel === channel
          );

          if (!sighting) return true; // If no sighting data, assume it's unspawned

          const now = new Date();
          const earliest = sighting.respawnRange.earliest.toDate();

          return now >= earliest; // Only keep channels where the respawn window has started
        })
      : [];

  return (
    <div>
      <Box sx={{ width: "100vw" }}>
        {/* AppBar */}
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Monster Tracker
            </Typography>
            <Button
              color="inherit"
              onClick={() => setIsAddMonsterModalOpen(true)}
            >
              Add Monster
            </Button>
            <Button
              color="inherit"
              onClick={() => setIsAddSightingModalOpen(true)} // Open AddSightingModal
            >
              Add Sighting
            </Button>
            <Button color="inherit" onClick={handleClearAllSightings}>
              Clear All Sightings
            </Button>
          </Toolbar>
        </AppBar>

        {/* AddMonsterModal */}
        <AddMonsterModal
          isOpen={isAddMonsterModalOpen}
          onClose={() => setIsAddMonsterModalOpen(false)}
          onAdd={() => setIsAddMonsterModalOpen(false)}
        />

        {/* AddSightingModal */}
        <AddSightingModal
          isOpen={isAddSightingModalOpen}
          onClose={() => setIsAddSightingModalOpen(false)}
          onAdd={() => setIsAddSightingModalOpen(false)} // Refresh sightings list
          monsters={monsters}
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
                width: { xs: "100%", md: "100%" },
                alignItems: "center",
                justifyContent: "center",
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

            {/* Group: Channel Selector and Unspawned Channels */}
            <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
              {/* Channel Selector and Actions */}
              <Grid2
                container
                sx={{
                  width: "50%",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                spacing={2}
              >
                <Grid2>
                  <ChannelSelector
                    selectedChannel={channel}
                    onSelectChannel={setChannel}
                  />
                  {selectedMonster && (
                    <SightingActions
                      onFound={handleFound}
                      selectedMonster={selectedMonster}
                      selectedMap={selectedMap}
                      channel={channel}
                    />
                  )}
                </Grid2>
              </Grid2>

              {/* Unspawned Channels */}
              <Grid2
                sx={{
                  width: "50%",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <UnspawnedChannels
                  channels={currentUnspawnedChannels}
                  onRestart={handleRestart}
                />
              </Grid2>
            </Box>

            {/* Monster List */}
            <Grid2>
              <MonsterList
                sightings={sightings}
                onDelete={handleDeleteSighting}
              />
            </Grid2>
          </Grid2>
        </Container>
      </Box>
      <ToastContainer
        position="bottom-center" // Position of the toasts
        autoClose={3000} // Auto-close after 3 seconds
        hideProgressBar={false} // Show a progress bar
        newestOnTop={false} // New toasts appear below older ones
        closeOnClick // Close toasts when clicked
        rtl={false} // Left-to-right layout
        pauseOnFocusLoss // Pause toasts when the window loses focus
        draggable // Allow toasts to be dragged
        pauseOnHover // Pause toasts when hovered
      />
    </div>
  );
}

export default App;
