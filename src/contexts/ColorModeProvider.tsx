import React, {createContext, useMemo, useState} from "react";
import {useAppDispatch, useAppSelector} from "../app/hook";
import {selectDarkMode, setDarkMode} from "../features/config/configSlice";
import createTheme from "@mui/material/styles/createTheme";
import {pink, purple} from "@mui/material/colors";
import {PaletteMode, ThemeProvider, useMediaQuery} from "@mui/material";

const ColorModeContext = createContext({
    toggleColorMode: () => {
    },
});

export const ColorModeProvider = ({children}: React.PropsWithChildren) => {
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
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ColorModeContext;
