import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {Container, CssBaseline} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {ColorModeProvider} from "../contexts/ColorModeProvider";
import {AlertProvider} from "../contexts/AlertProvider";
import AuthStatus from "./AuthStatus.tsx";
import {DialogProvider} from "../contexts/DialogProvider.tsx";
import React from "react";

const ApplyProvider = ({children}: React.PropsWithChildren) => {
    return (
        <ColorModeProvider>
            <AlertProvider>
                <DialogProvider>{children}</DialogProvider>
            </AlertProvider>
        </ColorModeProvider>
    );
};

const BasicLayout = () => {
    return (
        <Box sx={{display: "flex", margin: 0, height: "100vh"}}>
            <CssBaseline/>
            <AuthStatus/>
            <Header/>
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: "auto",
                }}
            >
                <Toolbar/>
                <Container maxWidth={false} sx={{my: 2}}>
                    <Outlet/>
                </Container>
            </Box>
            <Footer/>
        </Box>
    );
};

const Layout = () => {
    return (
        <ApplyProvider>
            <BasicLayout/>
        </ApplyProvider>
    );
};

export default Layout;
