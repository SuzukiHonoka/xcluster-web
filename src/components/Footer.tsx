import { Box } from "@mui/material";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "calc(10% + 60px)",
        position: "fixed",
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      component="footer"
    >
      <Copyright />
    </Box>
  );
};

export default Footer;
