import {useParams} from "react-router-dom";
import PluginTabs from "../../components/PluginTabs";
import Typography from "@mui/material/Typography";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {useDialog} from "../../app/hook";

const ServerControl = () => {
    const dialog = useDialog();
    const {id} = useParams();
    // reject if params not exist
    if (!id) {
        return <Typography variant="h1"> SERVER ID NOT FOUND</Typography>;
    }
    // todo: validate and fetch server info
    const name = "Server-1";
    const specs = "1 GB RAM, 2 Core CPU, 50GB DISK";
    const group = "GROUP1";
    const status = "RUNNING";
    const ip = "127.0.0.1";

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
                            <Button variant="contained" color="primary">
                                REBOOT
                            </Button>
                            <Button
                                //disabled={status === "RUNNING"}
                                variant="contained"
                                color="secondary"
                            >
                                BOOT
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => {
                                    dialog(
                                        "Confirm Shutdown",
                                        "You will lose the CONNECTION to the target server unless you manually boot it.",
                                        () => {
                                            console.log("confirmed");
                                        }
                                    );
                                }}
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
                            color="warning.light" // "#687078"
                        >
                            {group}
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
                            color={status === "RUNNING" ? "success.main" : "error.main"}
                        >
                            {status}
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
                    <PluginTabs id={id}/>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ServerControl;
