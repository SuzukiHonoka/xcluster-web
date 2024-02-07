import Grid from "@mui/material/Grid";
import Server from "../../components/Server.tsx";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import {useAlert, useAppDispatch, useAppSelector} from "../../app/hook.ts";
import {
    resetStatus,
    selectError,
    selectServers,
    selectStatus,
} from "../../features/server/serverSlice.ts";
import {useEffect} from "react";

const ServerGrid = () => {
    const dispatch = useAppDispatch();
    const alert = useAlert();
    const serversError = useAppSelector(selectError);
    const serversStatus = useAppSelector(selectStatus);
    const servers = useAppSelector(selectServers);

    useEffect(() => {
        if (serversStatus === "failed") alert(serversError!, "error");
        return () => {
            dispatch(resetStatus());
        };
    }, [alert, dispatch, serversError, serversStatus]);
    // test server data
    // const test = [];
    // for (let i = 0; i < 35; i++) {
    //   test.push(
    //     <Grid item key={i}>
    //       <Server id="123" />
    //     </Grid>
    //   );
    // }

    const renderGrids = servers.map(({id}, index) => (
        <Grid item key={index}>
            <Server id={id}/>
        </Grid>
    ));

    return (
        <Box display="flex">
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                {renderGrids}
            </Grid>
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    bottom: 20,
                    right: 20,
                    position: "fixed",
                }}
            >
                <AddIcon/>
            </Fab>
        </Box>
    );
};

export default ServerGrid;
