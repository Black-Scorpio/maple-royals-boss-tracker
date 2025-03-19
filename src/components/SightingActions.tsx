import { Button, Stack } from "@mui/material";
import { SightingActionsProps } from "../interfaces";

export const SightingActions = ({
  onFound,
  selectedMonster,
  selectedMap,
  channel,
}: SightingActionsProps) => (
  <Stack direction="row" spacing={10} padding={2}>
    <Button variant="contained" color="primary" onClick={onFound} fullWidth>
      Found {selectedMonster?.name} in {selectedMap}, Channel {channel}
    </Button>
  </Stack>
);
