import { useEffect, useState } from "react";
import { Sighting } from "../interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon

interface MonsterListProps {
  sightings: Sighting[];
  onDelete: (sightingId: string) => void; // Callback to delete a sighting
}

export const MonsterList = ({ sightings, onDelete }: MonsterListProps) => {
  const [monsterFilter, setMonsterFilter] = useState<string>("");
  const [mapFilter, setMapFilter] = useState<string>("");
  const [channelFilter, setChannelFilter] = useState<number | "">("");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Sort sightings by earliest respawn time
  const sortedSightings = [...sightings].sort((a, b) => {
    return (
      a.respawnRange.earliest.toDate().getTime() -
      b.respawnRange.earliest.toDate().getTime()
    );
  });

  // Filter sightings
  const filteredSightings = sortedSightings.filter((sighting) => {
    return (
      (monsterFilter === "" || sighting.monsterName === monsterFilter) &&
      (mapFilter === "" || sighting.map === mapFilter) &&
      (channelFilter === "" || sighting.channel === channelFilter)
    );
  });

  // Format time without seconds
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getRespawnStatusAndColor = (sighting: Sighting) => {
    const now = new Date();
    const earliest = sighting.respawnRange.earliest.toDate(); // Exact respawn time
    const latest = sighting.respawnRange.latest.toDate(); // Latest possible respawn
    const respawnTime = new Date(earliest.getTime() + 15 * 60000); // 15 minutes after earliest

    const minutesUntilEarliest = Math.round(
      (earliest.getTime() - now.getTime()) / 60000
    );

    if (minutesUntilEarliest > 30) {
      return {
        status: `Respawns in ~${minutesUntilEarliest} minutes (${formatTime(
          earliest
        )})`,
        color: "#ffebee", // Far from respawning (Red)
      };
    } else if (minutesUntilEarliest > 0) {
      return {
        status: `Respawning soon! (~${minutesUntilEarliest} minutes)`,
        color: "#fff9c4", // Close to respawning (Yellow)
      };
    } else if (now >= earliest && now < respawnTime) {
      return {
        status: "Respawning soon!",
        color: "#e8f5e9", // Within respawn range (Light Green)
      };
    } else if (now >= respawnTime && now < latest) {
      return {
        status: "Respawning now!",
        color: "#c8e6c9", // Exact respawn time (Dark Green)
      };
    } else {
      return {
        status: "Already respawned",
        color: "#ffebee", // Already respawned (Red)
      };
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Monster Sightings
      </Typography>

      {/* Filters */}
      <Grid2>
        <Grid2>
          <FormControl fullWidth>
            <InputLabel>Filter by Monster</InputLabel>
            <Select
              value={monsterFilter}
              onChange={(e) => setMonsterFilter(e.target.value as string)}
              label="Filter by Monster"
            >
              <MenuItem value="">All Monsters</MenuItem>
              {[...new Set(sightings.map((s) => s.monsterName))].map(
                (monster) => (
                  <MenuItem key={monster} value={monster}>
                    {monster}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2>
          <FormControl fullWidth>
            <InputLabel>Filter by Map</InputLabel>
            <Select
              value={mapFilter}
              onChange={(e) => setMapFilter(e.target.value as string)}
              label="Filter by Map"
            >
              <MenuItem value="">All Maps</MenuItem>
              {[...new Set(sightings.map((s) => s.map))].map((map) => (
                <MenuItem key={map} value={map}>
                  {map}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2>
          <FormControl fullWidth>
            <InputLabel>Filter by Channel</InputLabel>
            <Select
              value={channelFilter}
              onChange={(e) =>
                setChannelFilter(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              label="Filter by Channel"
            >
              <MenuItem value="">All Channels</MenuItem>
              {[...Array(20)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  Channel {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
      </Grid2>

      {/* Sightings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Monster</TableCell>
              <TableCell>Map</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Last Found At</TableCell>
              <TableCell>Respawn Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSightings.map((sighting) => {
              const { status, color } = getRespawnStatusAndColor(sighting);
              return (
                <TableRow
                  key={sighting.id}
                  sx={{ backgroundColor: color }} // Apply dynamic background color
                >
                  <TableCell>{sighting.monsterName}</TableCell>
                  <TableCell>{sighting.map}</TableCell>
                  <TableCell>{sighting.channel}</TableCell>
                  <TableCell>{formatTime(sighting.foundAt.toDate())}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => onDelete(sighting.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
