import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PageNotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3">404 Page Not Found</Typography>
      <Typography variant="h5" mt="20px">Check your URL and try again</Typography>
    </Box>
  );
};

export default PageNotFound;
