import {createContext, useMemo, useState } from "react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import useMediaQuery from "@mui/material/useMediaQuery";
import createTheme from "@mui/material/styles/createTheme";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Container, CssBaseline } from "@mui/material";
import { PaletteMode } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../app/hook";
import { selectDarkMode, setDarkMode } from "../features/config/configSlice";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

const Layout = () => {
  const dispatch = useAppDispatch()
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const configDarkMode = useAppSelector(selectDarkMode)
  const [mode, setMode] = useState( configDarkMode ?? prefersDarkMode  ? "dark" : "light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const mode = prevMode === "light" ? "dark" : "light"
          dispatch(setDarkMode(mode === "dark"))
          return mode
        });
      },
    }),
    [setDarkMode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as PaletteMode,
        },
      }),
    [mode]
  );

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Container maxWidth={false} disableGutters component="main">
            <Outlet />
          </Container>
          <Footer />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default Layout;
