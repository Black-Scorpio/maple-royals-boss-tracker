import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
} from "@mui/material";

interface MonsterFiltersProps {
  monsterFilter: string;
  setMonsterFilter: (value: string) => void;
  mapFilter: string;
  setMapFilter: (value: string) => void;
  channelFilter: number | "";
  setChannelFilter: (value: number | "") => void;
  sightings: { monsterName: string; map: string; channel: number }[];
}

export const MonsterFilters = ({
  monsterFilter,
  setMonsterFilter,
  mapFilter,
  setMapFilter,
  channelFilter,
  setChannelFilter,
  sightings,
}: MonsterFiltersProps) => (
  <Grid2 container spacing={2} alignItems="center" padding={2}>
    <Grid2 sx={{ width: "30%" }}>
      <FormControl fullWidth>
        <InputLabel>Filter by Monster</InputLabel>
        <Select
          value={monsterFilter}
          onChange={(e) => setMonsterFilter(e.target.value as string)}
          label="Filter by Monster"
        >
          <MenuItem value="">All Monsters</MenuItem>
          {[...new Set(sightings.map((s) => s.monsterName))].map((monster) => (
            <MenuItem key={monster} value={monster}>
              {monster}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid2>
    <Grid2 sx={{ width: "30%" }}>
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
    <Grid2 sx={{ width: "30%" }}>
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
);
