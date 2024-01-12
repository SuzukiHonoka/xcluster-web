import React from "react";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{
        width: "100%",
        minHeight: "60vh",
      }}
      {...other}
    >
      {value === index && (
        <Box sx={{ display: "flex", px: "20px", py: "10px" }}>{children}</Box>
      )}
    </div>
  );
};

export default TabPanel;
