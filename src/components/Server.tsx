import {Divider, Menu, MenuItem, Paper, Stack,} from "@mui/material";
import Link from "@mui/material/Link";
import {Link as RouterLink} from "react-router-dom";
import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TuneIcon from "@mui/icons-material/Tune";

interface ServerProps {
    id: string;
}

const Server = ({id}: ServerProps) => {
    //const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const name = "Server-1";
    const specs = "1 GB RAM, 2 Core CPU, 50GB DISK";
    const group = "GROUP1";
    const status = "RUNNING";
    const ip = "127.0.0.1";
    //todo: select server by id

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event.currentTarget)
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const renderMenu = (
        <Menu
            id="menu-server"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "center",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "center",
            }}
            open={open}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Manage</MenuItem>
            <MenuItem onClick={handleMenuClose}>Reboot</MenuItem>
            <MenuItem onClick={handleMenuClose}>Shutdown</MenuItem>
            <MenuItem onClick={handleMenuClose}>Remove</MenuItem>
        </Menu>
    );

    return (
        <Paper
            elevation={5}
            sx={{
                // minWidth: "150px",
                // minHeight: "60px",
                borderRadius: "8px",
                py: "10px",
                px: "15px",
                // mx: "10px",
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
                // justifyContent: "center",
            }}
        >
            <Grid container spacing={0} alignItems="center" maxWidth="300px">
                <Grid item xs={10}>
                    <Link
                        variant="h1"
                        underline="none"
                        color="primary.main"
                        fontSize={32}
                        //color="#0972d3"
                        component={RouterLink}
                        to={`/dashboard/server/${id}`}
                    >
                        {/* todo: configurable website title */}
                        {name}
                    </Link>
                </Grid>
                <Grid item xs={2}>
                    <Stack direction="row" justifyContent="flex-end">
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            id={`server-button-${id}`}
                            aria-label="menu"
                            aria-controls={open ? "menu-server" : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                        >
                            <TuneIcon/>
                        </IconButton>
                        {renderMenu}
                    </Stack>
                </Grid>
                <Grid item xs={10}>
                    <Typography
                        variant="body1"
                        fontSize={13}
                        fontWeight="bold"
                        color="info.main" //"#687078"
                    >
                        {specs}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography
                        variant="body1"
                        fontSize={13}
                        //fontWeight="bold"
                        color="warning.light" // "#687078"
                    >
                        {group}
                    </Typography>
                </Grid>
                <Grid item xs={12} my="5px">
                    <Divider
                        sx={{
                            borderStyle: "dashed",
                            borderWidth: 1,
                        }}
                    />
                </Grid>
                <Grid item xs={10}>
                    <Typography
                        variant="body1"
                        fontSize={13}
                        //fontWeight="bold"
                        color={status === "RUNNING" ? "success.main" : "error.main"}
                    >
                        {status}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography
                        variant="body1"
                        fontSize={13}
                        fontWeight="bold"
                        color="secondary.main" //"#687078"
                    >
                        {ip}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Server;