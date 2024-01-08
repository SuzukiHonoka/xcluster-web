import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {Container, CssBaseline} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {ColorModeProvider} from "../contexts/ColorModeProvider";
import {AlertProvider} from "../contexts/AlertProvider";
import AuthStatus from "./AuthStatus.tsx";

const Layout = () => {
    return (
        <ColorModeProvider>
            <AlertProvider>
                <Box sx={{display: "flex", margin: "0", height: "100vh"}}>
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
                        <Container maxWidth={false} sx={{mt: 3, mb: 3}}>
                            <Outlet/>
                        </Container>
                    </Box>
                    <Footer/>
                </Box>
            </AlertProvider>
        </ColorModeProvider>
    );
};

export default Layout;
