import React from "react";
import Box from "@mui/material/Box";

const CenteredBox = ({ children }: React.PropsWithChildren) => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
