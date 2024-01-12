import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface UsageStatusProps {
  section: string;
  caption: string;
  value: number;
  color:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit";
}

const UsageStatus = ({ section, caption, value, color }: UsageStatusProps) => {
  return (
    <Stack direction="column" justifyContent="flex-start">
      <Typography
        variant="h1"
        fontSize={20}
        //fontWeight="normal"
        color="primary.main"
      >
        {section}
      </Typography>
      <Typography
        variant="body1"
        fontSize={15}
        //fontWeight="normal"
        color="primary.main"
      >
        {caption}
      </Typography>
      <LinearProgress
        //color="primary"
        variant="determinate"
        value={value}
        color={color}
        sx={{
          maxWidth: "150px",
        }}
      />
    </Stack>
  );
};

export default UsageStatus;
