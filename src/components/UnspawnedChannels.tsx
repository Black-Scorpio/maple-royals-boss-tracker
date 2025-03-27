import { Chip, Paper, Typography, Box, Button } from "@mui/material";
import { UnspawnedChannelsProps } from "../interfaces";

export const UnspawnedChannels = ({
  channels,
  onRestart,
}: UnspawnedChannelsProps) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Untracked Channels
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, width: "50%" }}>
      {channels.map((ch) => (
        <Chip key={ch} label={ch} size="small" color="secondary" />
      ))}
    </Box>
    {/* Add the Restart Hunting Session button */}
    <Button
      variant="outlined"
      color="secondary"
      onClick={onRestart}
      fullWidth
      sx={{ mt: 2 }} // Add some margin-top for spacing
    >
      Restart Hunting Session
    </Button>
  </Paper>
);
