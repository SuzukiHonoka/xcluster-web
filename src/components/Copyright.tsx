import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React from "react";

type TypographyProps = React.ComponentProps<typeof Typography>;
const Copyright = (props: TypographyProps) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://xcluster.starx.ink/">
        Xcluster
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
