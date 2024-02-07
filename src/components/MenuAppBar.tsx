import React, { useState } from "react";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
//import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import StorageIcon from "@mui/icons-material/Storage";
import ExtensionIcon from "@mui/icons-material/Extension";
import ShieldIcon from "@mui/icons-material/Shield";
//import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useColorMode } from "../app/hook";
import { selectIsAuthenticated, userLogout } from "../features/auth/authSlice";
import Link from "@mui/material/Link";
import { Stack, Typography } from "@mui/material";

export const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  // commented since it may block smooth transition and causing not showing behaviour
  //shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const MenuAppBar = () => {
  // {/*// todo: profile card, with name and role*/}
  // {/*<MenuItem onClick={handleUserClose}>Profile</MenuItem>*/}
  // {/*<MenuItem onClick={handleUserClose}>My account</MenuItem>*/}
  const theme = useTheme();
  const colorMode = useColorMode();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectIsAuthenticated);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorUserEl, setAnchorUserEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUserEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorUserEl(null);
  };

  const handleUserLogout = () => {
    dispatch(userLogout());
    handleUserClose();
  };

  const handleUserLogin = () => {
    navigate("/login");
    handleUserClose();
  };

  const handleColorModeToggle = () => {
    colorMode.toggleColorMode();
  };

  const DrawerItems = {
    Home: {
      authRequired: true,
      icon: HomeIcon,
      callback: () => navigate("/dashboard/home"),
    },
    Server: {
      authRequired: true,
      icon: StorageIcon,
      callback: () => navigate("/dashboard/server"),
    },
    Plugin: {
      authRequired: true,
      icon: ExtensionIcon,
      callback: () => navigate("/dashboard/plugin"),
    },
    Security: {
      authRequired: true,
      icon: ShieldIcon,
      callback: () => navigate("/dashboard/security"),
    },
    // Status: {
    //   authRequired: true,
    //   icon: OfflineBoltIcon,
    //   callback: () => navigate("/dashboard/status"),
    // },
    User: {
      authRequired: true,
      icon: ManageAccountsIcon,
      callback: () => navigate("/dashboard/user"),
    },
    // Settings: {
    //   authRequired: true,
    //   icon: SettingsIcon,
    //   callback: () => navigate("/dashboard/settings"),
    // },
    //
    "Sign in": {
      authRequired: false,
      icon: PersonIcon,
      callback: () => navigate("/login"),
    },
  };

  const renderUserMenu = (
    <Menu
      id="menu-appbar"
      anchorEl={anchorUserEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorUserEl)}
      onClose={handleUserClose}
    >
      {auth ? (
        <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
      ) : (
        <MenuItem onClick={handleUserLogin}>Sign in</MenuItem>
      )}
    </Menu>
  );

  const renderMenu = (
    <Box sx={{ display: "flex" }}>
      <Tooltip title="DarkMode Switch">
        <IconButton onClick={handleColorModeToggle}>
          {theme.palette.mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
      {auth && (
        <Tooltip title="User">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  const renderDrawerItems = (
    <Box>
      <List>
        {Object.entries(DrawerItems).map(([text, params]) => (
          <ListItem
            key={text}
            disablePadding
            sx={{
              display: params.authRequired
                ? auth
                  ? "block"
                  : "none"
                : auth
                ? "none"
                : "block",
            }}
            onClick={params.callback}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: openDrawer ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: openDrawer ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {<params.icon />}
                {/* {renderDrawerItemIcons(text)} */}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{ opacity: openDrawer ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box display="flex">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Tooltip title="Menu">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Link
            variant="h6"
            underline="none"
            color="white"
            component={RouterLink}
            to="/"
            replace
          >
            {/* todo: configurable website title */}
            Xcluster
          </Link>
          <Typography ml={1} variant="subtitle1" color="white">
            {/* todo: configurable website subtitle */}
            {"- Next Generation Cluster Controlling System"}
          </Typography>
          <Stack flexGrow={1} direction="row" justifyContent="flex-end">
            {renderMenu}
            {renderUserMenu}
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        hidden={!auth && !openDrawer}
        variant={auth ? "permanent" : "persistent"}
        anchor="left"
        open={openDrawer}
      >
        <Toolbar />
        {renderDrawerItems}
      </Drawer>
    </Box>
  );
};

export default MenuAppBar;
