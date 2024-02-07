import { Divider, Menu, MenuItem, Paper, Stack } from "@mui/material";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TuneIcon from "@mui/icons-material/Tune";
import { useAlert, useAppDispatch, useAppSelector } from "../app/hook";
import {
  fBoot,
  fShutdown,
  removeServerByID,
  selectServerById,
} from "../features/server/serverSlice";
import { delay } from "../utils/delay";
import { generateRandomNumber } from "../utils/random";

interface ServerProps {
  id: string;
  //   name: string;
  //   specs: string;
  //   groupID: number;
  //   online: boolean;
  //   ip: string;
}

const Server = ({ id }: ServerProps) => {
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const server = useAppSelector((state) => selectServerById(state, id));
  const { name, specs, groupID, online, ip } = server || {};

  const randomDelay = generateRandomNumber(3000, 10000);

  const handleShutdown = async () => {
    handleMenuClose();
    alert("Shutting down server...", "info");
    console.log(`Waiting for ${randomDelay / 1000} seconds...`, "info");
    await delay(randomDelay);
    dispatch(fShutdown(id));
    alert("Server shutdown!", "success");
  };
  const handleReboot = async () => {
    handleMenuClose();
    alert("Rebooting server...", "info");
    dispatch(fShutdown(id));
    console.log(`Waiting for ${randomDelay / 1000} seconds...`, "info");
    await delay(randomDelay);
    dispatch(fBoot(id));
    alert("Server rebooted!", "success");
  };

  const handleBoot = async () => {
    handleMenuClose();
    alert("Booting server...", "info");
    console.log(`Waiting for ${randomDelay / 1000} seconds...`, "info");
    await delay(randomDelay);
    dispatch(fBoot(id));
    alert("Server booted!", "success");
  };

  const handleRemove = () => {
    handleMenuClose();
    dispatch(removeServerByID(id));
    alert("Server removed!", "success");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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
      {/* <MenuItem onClick={handleMenuClose}>Manage</MenuItem> */}
      <MenuItem disabled={online} onClick={handleBoot}>
        Boot
      </MenuItem>
      <MenuItem onClick={handleReboot}>Reboot</MenuItem>
      <MenuItem disabled={!online} onClick={handleShutdown}>
        Shutdown
      </MenuItem>
      <MenuItem onClick={handleRemove}>Remove</MenuItem>
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
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
              <TuneIcon />
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
            color="warning.main" // "#687078"
          >
            {`Group-${groupID}`}
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
            color={online ? "success.main" : "error.main"}
          >
            {online ? "RUNNING" : "OFFLINE"}
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
