import MenuAppBar from "./MenuAppBar";
import Box from "@mui/material/Box";

// export interface HeaderProps{
//     appBarProps?: MenuAppBarProps,
// }

const Header = () => {
  return (
      <Box sx={{display: "flex"}} component="header">
        <MenuAppBar />
      </Box>
  );
};

export default Header;
