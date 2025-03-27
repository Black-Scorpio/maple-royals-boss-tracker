import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
} from "@mui/material";

interface AboutProps {
  onClose: () => void;
}

export const About = ({ onClose }: AboutProps) => {
  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto", my: 4 }}>
      <Typography variant="h4" gutterBottom>
        About the Monster Tracker App
      </Typography>

      <Typography variant="body1" paragraph>
        Welcome to the Monster Tracker App! This app helps you track monster
        spawns and predict their respawn times. Below is a guide on how to use
        the app effectively.
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* How to Use the App */}
      <Typography variant="h5" gutterBottom>
        How to Use the App
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="1. Marking a Monster as Found"
            secondary={
              <>
                After you've killed the monster, hit the{" "}
                <strong>"Found Monster"</strong> button. This will update the
                respawn timer and help you predict when the monster will appear
                again.
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="2. Favoriting Monsters"
            secondary={
              <>
                You can favorite monsters by clicking the star icon next to
                their name. Favorites are stored in{" "}
                <strong>local storage</strong>, so they will reset if you close
                the browser tab or clear your browser data. Use this feature to
                quickly access your most-tracked monsters.
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="3. Adding a Sighting"
            secondary={
              <>
                If you want to predict a monster spawn or believe it was killed
                at a certain time, use the <strong>"Add Sighting"</strong>{" "}
                button to add the monster to the sighting table. This will help
                you track when the monster might respawn.
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="4. Filtering Monster Sightings"
            secondary={
              <>
                You can filter the Monster Sightings Table by selecting
                specific:
                <ul
                  style={{
                    marginTop: "4px",
                    marginBottom: "4px",
                    paddingLeft: "20px",
                  }}
                >
                  <li>
                    <strong>Monsters</strong> from the dropdown
                  </li>
                  <li>
                    <strong>Maps</strong> where they spawn
                  </li>
                  <li>
                    <strong>Channels</strong> where they were last seen
                  </li>
                </ul>
                This helps you focus on specific monsters or hunting areas.
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="5. Timezone Support"
            secondary={
              <>
                The app supports both <strong>Eastern Time (ET)</strong> for
                your local time and <strong>GMT</strong> (24-hour format) which
                matches the game's timezone. Use the toggle button in the
                monster table to switch between timezones. GMT times will
                display in 24-hour format while ET uses 12-hour AM/PM format.
              </>
            }
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      {/* About the Creator */}
      <Typography variant="h5" gutterBottom>
        About the Creator
      </Typography>
      <Typography variant="body1" paragraph>
        This app was created by IGN:{" "}
        <strong>Hypoactivity ~ CLOUDY GANG ~</strong>. If you have any feedback
        or suggestions, feel free to reach out!
      </Typography>

      <Typography variant="body1" paragraph>
        Thank you for using the Monster Tracker App. Happy hunting!
      </Typography>

      {/* Close Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Paper>
  );
};
