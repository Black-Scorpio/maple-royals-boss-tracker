import { Button, Grid2, Typography, Box } from "@mui/material";

interface ChannelSelectorProps {
  selectedChannel: number;
  onSelectChannel: (channel: number) => void;
}

export const ChannelSelector = ({
  selectedChannel,
  onSelectChannel,
}: ChannelSelectorProps) => {
  const channels = Array.from({ length: 20 }, (_, index) => index + 1);

  return (
    <Box sx={{ textAlign: "center" }}>
      {/* "Select Channel" Text */}
      <Typography variant="h6" gutterBottom>
        Select Channel
      </Typography>

      {/* Channel Buttons */}
      <Grid2 container spacing={1}>
        {channels.map((channel) => (
          <Grid2 key={channel}>
            <Button
              variant="contained"
              onClick={() => onSelectChannel(channel)}
              sx={{
                width: "100%",
                backgroundColor: selectedChannel === channel ? "green" : "gray",
                color: "white",
                "&:hover": {
                  backgroundColor:
                    selectedChannel === channel ? "darkgreen" : "darkgray",
                },
              }}
            >
              {channel}
            </Button>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};
