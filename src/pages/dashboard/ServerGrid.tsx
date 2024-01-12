import Grid from "@mui/material/Grid";
import Server from "../../components/Server.tsx";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

const ServerGrid = () => {
  // test server data
  const test = [];
  for (let i = 0; i < 35; i++) {
    test.push(
      <Grid item key={i}>
        <Server id="123" />
      </Grid>
    );
  }
  return (
    <Box display="flex">
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {test}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          bottom: 20,
          right: 20,
          position: "fixed",
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ServerGrid;
