import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useCallback, useEffect } from "react";
import CustomPagination from "../../components/CustomPagination";
import LinearProgress from "@mui/material/LinearProgress";
import { useAlert, useAppDispatch, useAppSelector } from "../../app/hook.ts";
import {
  //   fetchPlugins,
  //   reset,
  resetStatus,
  selectError,
  selectStatus,
  selectPlugins,
  //   pluginEnable,
  //   pluginDisable,
  fDisable,
  fEnable,
} from "../../features/plugins/pluginsSlice.ts";
import { selectIsAdmin } from "../../features/auth/authSlice.ts";
import Typography from "@mui/material/Typography";
import CustomNoRowsOverlay from "../../components/CustomNoRowsOverlay.tsx";
import CustomToolbar from "../../components/CustomToolbar.tsx";
const PluginManage = () => {
  const dispatch = useAppDispatch();
  const alert = useAlert();

  const isAdmin = useAppSelector(selectIsAdmin);
  const pluginsError = useAppSelector(selectError);
  const pluginsStatus = useAppSelector(selectStatus);
  const rows = useAppSelector(selectPlugins);

  // show success or error status
  useEffect(() => {
    console.log("pluginsStatus:", pluginsStatus);
    if (pluginsStatus === "succeed") {
      alert("Operation succeed", "success");
    } else if (pluginsStatus === "failed") {
      alert(pluginsError!, "error");
    }
    return () => {
      dispatch(resetStatus());
    };
  }, [alert, dispatch, pluginsError, pluginsStatus]);

  // todo: backend not ready
  //   // fetch plugins
  //   useEffect(() => {
  //     if (isAdmin) {
  //       dispatch(fetchPlugins());
  //     } else {
  //       dispatch(reset());
  //     }
  //   }, [dispatch, isAdmin]);

  const handleDisableClick = useCallback(
    (id: number) => () => {
      //dispatch(pluginDisable(id));
      dispatch(fDisable(id));
    },
    [dispatch]
  );

  const handleEnableClick = useCallback(
    (id: number) => () => {
      //dispatch(pluginEnable(id));
      dispatch(fEnable(id));
    },
    [dispatch]
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      type: "number",
      headerName: "ID",
      width: 150,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "name",
      type: "string",
      headerName: "Name",
      width: 200,
      align: "left",
    },
    {
      field: "description",
      type: "string",
      headerName: "Description",
      width: 350,
      align: "left",
    },
    {
      field: "enabled",
      type: "boolean",
      headerName: "Enabled",
      width: 120,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 200,
      getActions: ({ row }) => {
        const { id, enabled } = row;
        if (enabled) {
          return [
            <GridActionsCellItem
              icon={<ToggleOffIcon />}
              label="Disable"
              sx={{
                color: "primary.main",
              }}
              onClick={handleDisableClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<ToggleOnIcon />}
            label="Enable"
            className="textPrimary"
            onClick={handleEnableClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // only admin can access this page
  if (!isAdmin) return <Typography variant="h1">Admin Required</Typography>;
  return (
    <Box
      sx={{
        height: "85vh",
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        pagination
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        editMode="row"
        //checkboxSelection
        disableRowSelectionOnClick
        slots={{
          toolbar: CustomToolbar,
          pagination: CustomPagination,
          noRowsOverlay: CustomNoRowsOverlay,
          loadingOverlay: LinearProgress,
        }}
        loading={pluginsStatus === "loading"}
      />
    </Box>
  );
};

export default PluginManage;
