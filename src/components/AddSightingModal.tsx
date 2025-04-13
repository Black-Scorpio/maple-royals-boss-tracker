import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Monster } from "../interfaces";
import { saveSighting } from "../services/firebaseService";
import { toast } from "react-toastify";

interface AddSightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  monsters: Monster[];
}

export const AddSightingModal = ({
  isOpen,
  onClose,
  onAdd,
  monsters,
}: AddSightingModalProps) => {
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>("");
  const [channel, setChannel] = useState<number>(1);
  const [foundAt, setFoundAt] = useState<string>("");

  // Set default date when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      // Format as YYYY-MM-DDTHH:MM (datetime-local format)
      const formattedDate = now.toISOString().slice(0, 16);
      setFoundAt(formattedDate);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMonster || !selectedMap || !foundAt) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      await saveSighting(
        selectedMonster,
        selectedMap,
        channel,
        new Date(foundAt)
      );
      toast.success(
        `Sighting added successfully! ${selectedMonster.name} in Channel ${channel}`
      );
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error adding sighting:", error);
      toast.error("Error adding sighting. Please try again.");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="add-sighting-modal"
      aria-describedby="add-a-new-sighting"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "400px",
          maxWidth: "90%",
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add New Sighting
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* Monster Selector */}
            <FormControl fullWidth>
              <InputLabel>Monster</InputLabel>
              <Select
                value={selectedMonster?.name || ""}
                onChange={(e) => {
                  const monster = monsters.find(
                    (m) => m.name === e.target.value
                  );
                  setSelectedMonster(monster || null);
                  setSelectedMap(monster?.maps[0] || "");
                }}
                label="Monster"
                required
              >
                <MenuItem value="">Select a monster</MenuItem>
                {monsters.map((monster) => (
                  <MenuItem key={monster.id} value={monster.name}>
                    {monster.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Map Selector */}
            <FormControl fullWidth>
              <InputLabel>Map</InputLabel>
              <Select
                value={selectedMap}
                onChange={(e) => setSelectedMap(e.target.value as string)}
                label="Map"
                required
              >
                <MenuItem value="">Select a map</MenuItem>
                {selectedMonster?.maps.map((map) => (
                  <MenuItem key={map} value={map}>
                    {map}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Channel Selector */}
            <FormControl fullWidth>
              <InputLabel>Channel</InputLabel>
              <Select
                value={channel}
                onChange={(e) => setChannel(Number(e.target.value))}
                label="Channel"
                required
              >
                {[...Array(20)].map((_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    Channel {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Found At Time - Simplified */}
            <TextField
              label="Found At"
              type="datetime-local"
              value={foundAt}
              onChange={(e) => setFoundAt(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().slice(0, 16), // Prevent future dates
              }}
              fullWidth
              required
            />

            {/* Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Sighting
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={onClose}
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
