import React, {useState, useEffect} from "react";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {CSSObject, Theme, styled, useTheme} from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import StorageIcon from "@mui/icons-material/Storage";
import ExtensionIcon from "@mui/icons-material/Extension";
import ShieldIcon from "@mui/icons-material/Shield";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PersonIcon from "@mui/icons-material/Person";
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
// import { ColorModeContext } from "./Layout";
import {
    useAlert,
    useAppDispatch,
    useAppSelector,
    useColorMode,
} from "../app/hook";
import {
    selectError,
    selectIsAuthenticated,
    selectStatus,
    userLogout,
} from "../features/auth/authSlice";

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
    // commented since it may block smooth transition and casuing not showing behaviour
    //shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
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
    const theme = useTheme();
    const colorMode = useColorMode();
    const alert = useAlert();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {pathname} = useLocation();

    const auth = useAppSelector(selectIsAuthenticated);
    const authError = useAppSelector(selectError);
    const authStatus = useAppSelector(selectStatus);

    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorUserEl, setAnchorUserEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        console.log("appbar(authStatus):", authStatus);
        // Only alert logout error
        const blacklist = ["/login", "/register"];
        if (!blacklist.includes(pathname) && authStatus === "failed") {
            alert(`Authentication Error: ${authError!}`, "error");
            console.error("appbar(authError):", authError);
        }
    }, [authStatus, alert, authError, pathname]);

    useEffect(() => {
        console.log("appbar(auth):", auth);
        if (typeof auth === "undefined") {
            return;
        }
        alert(auth ? "Welcome Back!" : "Logged Out");
        if (!auth) {
            navigate("/login", {
                replace: true,
            });
        }
    }, [auth, alert, navigate]);

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorUserEl(event.currentTarget);
    };

    const handleUserClose = () => {
        setAnchorUserEl(null);
    };

    const handleColorModeToggle = () => {
        colorMode.toggleColorMode();
    };

    const DrawerItems = {
        Server: {
            authRequired: true,
            icon: StorageIcon,
            callback: () => navigate("/server"),
        },
        Plugin: {
            authRequired: true,
            icon: ExtensionIcon,
            callback: () => navigate("/plugin"),
        },
        Security: {
            authRequired: true,
            icon: ShieldIcon,
            callback: () => navigate("/security"),
        },
        Status: {
            authRequired: true,
            icon: OfflineBoltIcon,
            callback: () => navigate("/status"),
        },
        // admin management
        User: {
            authRequired: true,
            icon: ManageAccountsIcon,
            callback: () => navigate("/user"),
        },
        Settings: {
            authRequired: true,
            icon: SettingsIcon,
            callback: () => navigate("/settings"),
        },
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
                <div>
                    {/*// todo: profile card, with name and role*/}
                    {/*<MenuItem onClick={handleUserClose}>Profile</MenuItem>*/}
                    {/*<MenuItem onClick={handleUserClose}>My account</MenuItem>*/}
                    <MenuItem
                        onClick={() => {
                            dispatch(userLogout());
                            handleUserClose();
                        }}
                    >
                        Logout
                    </MenuItem>
                </div>
            ) : (
                <MenuItem
                    onClick={() => {
                        navigate("/login");
                        handleUserClose();
                    }}
                >
                    Sign in
                </MenuItem>
            )}
        </Menu>
    );

    const renderMenu = (
        <Box sx={{display: "flex"}}>
            <Tooltip title="DarkMode Switch">
                <IconButton onClick={handleColorModeToggle}>
                    {theme.palette.mode === "dark" ? <DarkModeIcon/> : <LightModeIcon/>}
                </IconButton>
            </Tooltip>
            <Tooltip title="User">
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleUserMenu}
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
            </Tooltip>
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
                                {<params.icon/>}
                                {/* {renderDrawerItemIcons(text)} */}
                            </ListItemIcon>
                            <ListItemText
                                primary={text}
                                sx={{opacity: openDrawer ? 1 : 0}}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{display: "flex"}}>
            <AppBar
                position="fixed"
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
            >
                <Toolbar>
                    <Tooltip title="Menu">
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography
                        variant="h6"
                        noWrap
                        color="#FFFFFF"
                        component={RouterLink}
                        to="/"
                        replace
                        sx={{
                            flexGrow: 1,
                            textDecoration: "none",
                        }}
                    >
                        {/* todo: configurable website title */}
                        Xcluster
                    </Typography>
                    <div>
                        {renderMenu}
                        {renderUserMenu}
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                hidden={!auth && !openDrawer}
                variant={auth ? "permanent" : "persistent"}
                anchor="left"
                open={openDrawer}
            >
                <Toolbar/>
                {renderDrawerItems}
            </Drawer>
        </Box>
    );
};

export default MenuAppBar;
