import { useState } from "react";
import { Button, Grid2 } from "@mui/material";

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
  );
};
