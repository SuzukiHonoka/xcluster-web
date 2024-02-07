import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PluginProps } from "../PluginTabs";
import { useAppSelector } from "../../app/hook";
import { selectServerById } from "../../features/server/serverSlice";

const Networking = ({ id }: PluginProps) => {
  const server = useAppSelector((state) => selectServerById(state, id));
  const { ip } = server || {};
  if (ip === undefined)
    return <Typography variant="h1"> SERVER NOT FOUND</Typography>;
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, disableColumnMenu: true },
    {
      field: "interface",
      headerName: "Interface",
      width: 130,
      disableColumnMenu: true,
    },
    { field: "ip", headerName: "IP", width: 130, disableColumnMenu: true },
  ];

  const row = [
    {
      id: 1,
      interface: "eth0",
      ip: ip,
    },
  ];

  return (
    <Box minWidth="60vh">
      <DataGrid columns={columns} rows={row} hideFooter />
    </Box>
  );
};

export default Networking;
