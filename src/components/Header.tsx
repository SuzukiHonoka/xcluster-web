import MenuAppBar from "./MenuAppBar";
import Box from "@mui/material/Box";

const Header = () => {
    return (
        <Box sx={{display: "flex"}} component="header">
            <MenuAppBar/>
        </Box>
    );
};

export default Header;
