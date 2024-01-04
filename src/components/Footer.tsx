import {Container} from "@mui/material";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        mr: 5,
        mt: 2,
        marginTop: "calc(10% + 60px)",
        position: "fixed",
        bottom: 0,
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}
      component="footer"
    >
      <Copyright />
    </Container>
  );
};

export default Footer;
