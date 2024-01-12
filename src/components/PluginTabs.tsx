import Box from "@mui/material/Box";
import Usage from "./plugin/Usage";
import Tabs from "@mui/material/Tabs";
import TabPanel from "./TabPanel";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import React, { useState } from "react";

export interface PluginProps {
  id: string;
}

type Plugin = {
  name: string;
  render?: (props: PluginProps) => React.ReactNode;
};

const plugins: Plugin[] = [
  { name: "Usage", render: Usage },
  { name: "Access", render: undefined },
  { name: "SSH Keys", render: undefined },
  { name: "Networking", render: undefined },
  { name: "Opts...", render: undefined },
];

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const PluginTabs = ({ id }: PluginProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        //mt: "3px",
        flexGrow: 1,
        display: "flex",
        height: "100%",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Server plugin tabs"
        sx={{
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        {plugins.map(({ name }, index) => (
          <Tab label={name} key={name} {...a11yProps(index)} />
        ))}
      </Tabs>
      {plugins.map((plugin, index) => (
        <TabPanel value={value} key={plugin.name} index={index}>
          {plugin.render ? (
            <plugin.render id={id} />
          ) : (
            <Typography>Developing..</Typography>
          )}
        </TabPanel>
      ))}
    </Box>
  );
};

export default PluginTabs;
