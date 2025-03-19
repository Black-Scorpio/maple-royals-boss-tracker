import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Sighting } from "../interfaces";
import { useEffect, useState } from "react"; // Import useEffect and useState

interface MonsterTableProps {
  sightings: Sighting[];
  onDelete: (sightingId: string) => void;
  formatTime: (date: Date) => string;
}

export const MonsterTable = ({
  sightings,
  onDelete,
  formatTime,
}: MonsterTableProps) => {
  const [currentTime, setCurrentTime] = useState(new Date()); // State to track current time

  // Update currentTime every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); // Update currentTime every 60 seconds
    }, 60000); // 60,000 milliseconds = 1 minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Helper function to determine respawn status and color
  const getRespawnStatusAndColor = (sighting: Sighting) => {
    const now = currentTime; // Use the currentTime state
    const earliest = sighting.respawnRange.earliest.toDate();
    const latest = sighting.respawnRange.latest.toDate();

    // Calculate the halfway point between earliest and latest
    const halfwayPoint = new Date(
      earliest.getTime() + (latest.getTime() - earliest.getTime()) / 2
    );

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
    } else if (now >= earliest && now < halfwayPoint) {
      return {
        status: `Respawn any second!`,
        color: "#e8f5e9", // Light Green (earliest to halfway)
      };
    } else if (now >= halfwayPoint && now < latest) {
      return {
        status: `Good chance it's spawned!`,
        color: "#c8e6c9", // Dark Green (halfway to latest)
      };
    } else {
      return {
        status: "Already respawned",
        color: "#ffebee", // Already respawned (Red)
      };
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Monster</TableCell>
            <TableCell>Map</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell>Last Found At</TableCell>
            <TableCell>Respawn Time Range</TableCell>
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
                <TableCell>{formatTime(sighting.foundAt.toDate())}</TableCell>
                <TableCell>
                  {`${formatTime(
                    sighting.respawnRange.earliest.toDate()
                  )} - ${formatTime(sighting.respawnRange.latest.toDate())}`}
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
