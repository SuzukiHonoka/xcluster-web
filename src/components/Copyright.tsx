import Link from "@mui/material/Link";
import Typography, {TypographyProps} from "@mui/material/Typography";

const Copyright = (props: TypographyProps) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="right"
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
