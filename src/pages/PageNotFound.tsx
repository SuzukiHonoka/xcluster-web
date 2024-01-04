import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";

const PageNotFound = () => {

  return (
      <Stack
          minHeight="80vh"
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}>
          <Typography variant="h3">404 Page Not Found</Typography>
          <Typography variant="subtitle1" color="text.secondary">Check your URL and try again</Typography>
      </Stack>
      );
};

export default PageNotFound;
