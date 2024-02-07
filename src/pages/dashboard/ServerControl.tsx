import { useParams } from "react-router-dom";
import PluginTabs from "../../components/PluginTabs";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {
  useAlert,
  useAppDispatch,
  useAppSelector,
  useDialog,
} from "../../app/hook";
import {
  fBoot,
  fShutdown,
  selectServerById,
} from "../../features/server/serverSlice";
import { delay } from "../../utils/delay";
import { generateRandomNumber } from "../../utils/random";

const ServerControl = () => {
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const dialog = useDialog();
  const { id } = useParams();
  const server = useAppSelector((state) => selectServerById(state, id));
  // reject if params not exist
  if (!id || !server) {
    return <Typography variant="h1"> SERVER NOT FOUND</Typography>;
  }
  // todo: validate and fetch server info
  const { name, specs, groupID, online, ip } = server;

  const randomDelay = generateRandomNumber(3000, 10000);

  const handleShutdown = async () => {
    alert("Shutting down server...", "info");
    console.log(`Waiting for ${randomDelay / 1000} seconds...`, "info");
    await delay(randomDelay);
    dispatch(fShutdown(id));
    alert("Server shutdown!", "success");
  };
  const handleReboot = async () => {
    alert("Rebooting server...", "info");
    dispatch(fShutdown(id));
    console.log(`Waiting for ${randomDelay / 1000} seconds...`, "info");
    await delay(randomDelay);
    dispatch(fBoot(id));
    alert("Server rebooted!", "success");
  };

  const handleBoot = async () => {
    alert("Booting server...", "info");
    console.log(`Waiting for ${randomDelay / 1000} seconds...`, "info");
    await delay(randomDelay);
    dispatch(fBoot(id));
    alert("Server booted!", "success");
  };

  const askShutdown = () => {
    dialog(
      "Confirm Shutdown",
      "Are you sure you want to shutdown?",
      handleShutdown
    );
  };

  const buttonTheme = createTheme({
    typography: {
      fontSize: 13,
    },
  });

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: "8px",
        py: "20px",
        px: "30px",
        display: "flex",

        m: {
          lg: "20px",
        },
      }}
    >
      <Grid container alignContent="center" alignItems="center">
        <Grid item xs={8}>
          <Typography variant="h1" color="primary.main" fontSize={42}>
            {name}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <ThemeProvider theme={buttonTheme}>
              <Button
                disabled={online}
                variant="contained"
                color="secondary"
                onClick={handleBoot}
              >
                BOOT
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReboot}
              >
                REBOOT
              </Button>
              <Button
                disabled={!online}
                variant="contained"
                color="warning"
                onClick={askShutdown}
              >
                SHUTDOWN
              </Button>
            </ThemeProvider>
          </Stack>
        </Grid>
        <Grid item xs={8}>
          <Stack direction="column" justifyContent="flex-start">
            <Typography
              variant="body1"
              fontSize={15}
              //fontWeight="bold"
              color="info.main" //"#687078"
            >
              {specs}
            </Typography>
            <Typography
              variant="body1"
              fontSize={15}
              fontWeight="normal"
              color="warning.main" // "#687078"
            >
              {`Group-${groupID}`}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack
            height="100%"
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Typography
              variant="body1"
              fontSize={22}
              fontWeight="normal"
              color="primary.main"
            >
              STATUS:
            </Typography>
            <Typography
              ml="10px"
              variant="body1"
              fontSize={22}
              //fontWeight="bold"
              color={online ? "success.main" : "error.main"}
            >
              {online ? "ONLINE" : "OFFLINE"}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider
            sx={{
              my: "5px",
              borderStyle: "dashed",
              borderWidth: 1,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end">
            <Typography
              mr="10px"
              variant="body1"
              fontSize={15}
              fontWeight="regular"
              color="primary.main"
            >
              Static IP:
            </Typography>
            <Typography
              variant="body1"
              fontSize={15}
              fontWeight="normal"
              color="secondary.main" //"#687078"
            >
              {ip}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <PluginTabs id={id} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ServerControl;
