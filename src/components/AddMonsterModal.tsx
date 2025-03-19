import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { addMonster } from "../services/firebaseService";
import { AddMonsterModalProps } from "../interfaces";
import { toast } from "react-toastify";

export const AddMonsterModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddMonsterModalProps) => {
  const [name, setName] = useState<string>("");
  const [respawnTime, setRespawnTime] = useState<number>(0);
  const [maps, setMaps] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !respawnTime || !maps) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      await addMonster(
        name,
        maps.split(",").map((map) => map.trim()),
        respawnTime
      );
      toast.success("Monster added successfully!");
      setName("");
      setRespawnTime(0);
      setMaps("");
      onAdd(); // Close the modal
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding monster:", error);
      toast.error("Error adding monster. Please try again.");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="add-monster-modal"
      aria-describedby="add-a-new-monster"
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
          Add New Monster
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Monster Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Respawn Time (hours)"
              type="number"
              value={respawnTime}
              onChange={(e) => setRespawnTime(Number(e.target.value))}
              required
              fullWidth
            />
            <TextField
              label="Maps (comma-separated)"
              value={maps}
              onChange={(e) => setMaps(e.target.value)}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="primary">
                Add Monster
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={onClose}
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
