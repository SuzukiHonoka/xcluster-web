import {createContext, useMemo, useState} from "react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import useMediaQuery from "@mui/material/useMediaQuery";
import createTheme from "@mui/material/styles/createTheme";
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {Container, CssBaseline} from "@mui/material";
import {PaletteMode} from "@mui/material";
import {useAppSelector, useAppDispatch} from "../app/hook";
import {selectDarkMode, setDarkMode} from "../features/config/configSlice";
import {pink, purple} from "@mui/material/colors";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export const ColorModeContext = createContext({
    toggleColorMode: () => {
    },
});

const Layout = () => {
    const dispatch = useAppDispatch();
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const configDarkMode = useAppSelector(selectDarkMode);
    const [mode, setMode] = useState(
        configDarkMode ?? prefersDarkMode ? "dark" : "light"
    );

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const mode = prevMode === "light" ? "dark" : "light";
                    dispatch(setDarkMode(mode === "dark"));
                    return mode;
                });
            },
        }),
        [dispatch]
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode as PaletteMode,
                    primary: purple,
                    secondary: pink,
                },
            }),
        [mode]
    );

    return (
        <>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <Box sx={{ display: "flex", margin: "0", height: "100vh"}}>
                        <CssBaseline/>
                        <Header/>
                        <Box sx={{
                            flexGrow: 1,
                            overflow: 'auto'
                        }}>
                            <Toolbar/>
                            <Container maxWidth={false} sx={{mt: 3, mb: 3}}>
                                <Outlet/>
                            </Container>
                        </Box>
                        <Footer/>
                    </Box>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </>
    );
};

export default Layout;
