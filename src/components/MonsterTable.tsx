import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Sighting } from "../interfaces";
import { useEffect, useState } from "react";

interface MonsterTableProps {
  sightings: Sighting[];
  onDelete: (sightingId: string) => void;
  formatTime: (date: Date, timezone?: "GMT" | "ET") => string; // Updated to accept timezone
}

export const MonsterTable = ({
  sightings,
  onDelete,
  formatTime, // Your existing formatTime function
}: MonsterTableProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useState<"GMT" | "ET">(() => {
    return localStorage.getItem("timezone") === "GMT" ? "GMT" : "ET";
  });

  // Update currentTime every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimezone = () => {
    const newTimezone = timezone === "GMT" ? "ET" : "GMT";
    setTimezone(newTimezone);
    localStorage.setItem("timezone", newTimezone);
  };

  // Helper function to determine respawn status and color
  const getRespawnStatusAndColor = (sighting: Sighting) => {
    const now = currentTime;
    const earliest = sighting.respawnRange.earliest.toDate();
    const latest = sighting.respawnRange.latest.toDate();

    const halfwayPoint = new Date(
      earliest.getTime() + (latest.getTime() - earliest.getTime()) / 2
    );

    const minutesUntilEarliest = Math.round(
      (earliest.getTime() - now.getTime()) / 60000
    );

    const formatTimeRemaining = (minutes: number) => {
      if (minutes >= 1440) {
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        return `${days}d ${hours}h`;
      } else if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
      } else {
        return `${minutes}m`;
      }
    };

    if (minutesUntilEarliest > 30) {
      return {
        status: `Respawns in ~${formatTimeRemaining(
          minutesUntilEarliest
        )} (${formatTime(earliest, timezone)})`,
        color: "#ffebee",
      };
    } else if (minutesUntilEarliest >= 0) {
      return {
        status: `Respawning soon! (~${formatTimeRemaining(
          minutesUntilEarliest
        )})`,
        color: "#fff9c4",
      };
    } else if (now >= earliest && now < halfwayPoint) {
      return {
        status: `Respawns any second!`,
        color: "#e8f5e9",
      };
    } else if (now >= halfwayPoint && now < latest) {
      return {
        status: `Good chance it's spawned!`,
        color: "#c8e6c9",
      };
    } else {
      return {
        status: "Already respawned",
        color: "#ffebee",
      };
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={7}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={toggleTimezone}
                  sx={{ mb: 1 }}
                >
                  Switch to {timezone === "GMT" ? "ET" : "GMT"} Time
                </Button>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Monster</TableCell>
            <TableCell>Map</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell>
              Last Found At{" "}
              <small>({timezone === "GMT" ? "24h" : "12h"})</small>
            </TableCell>
            <TableCell>
              Respawn Range{" "}
              <small>({timezone === "GMT" ? "24h" : "12h"})</small>
            </TableCell>
            <TableCell>Respawn Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sightings.map((sighting) => {
            const { status, color } = getRespawnStatusAndColor(sighting);
            return (
              <TableRow key={sighting.id} sx={{ backgroundColor: color }}>
                <TableCell>{sighting.monsterName}</TableCell>
                <TableCell>{sighting.map}</TableCell>
                <TableCell>{sighting.channel}</TableCell>
                <TableCell>
                  {formatTime(sighting.foundAt.toDate(), timezone)}
                </TableCell>
                <TableCell>
                  {`${formatTime(
                    sighting.respawnRange.earliest.toDate(),
                    timezone
                  )} - ${formatTime(
                    sighting.respawnRange.latest.toDate(),
                    timezone
                  )}`}
                </TableCell>
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
  );
};
