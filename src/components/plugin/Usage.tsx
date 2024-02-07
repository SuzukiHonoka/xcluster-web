import {Grid} from "@mui/material";
import {useEffect, useMemo} from "react";
import {PluginProps} from "../PluginTabs";
import UsageStatus from "./UsageStatus";
import {useAppDispatch, useAppSelector} from "../../app/hook.ts";
import {selectData, setData} from "../../features/plugins/pluginsSlice.ts";
import Typography from "@mui/material/Typography";
import {UsageData} from "../../models/plugin/usage.tsx";
import {ServerPerformance} from "../../utils/serverPerformanceGenerator";
import {selectServerById} from "../../features/server/serverSlice.ts";

function isUsageData(data: string | UsageData): data is UsageData {
    return (data as UsageData).cpuUsage !== undefined;
}

const Usage = ({id}: PluginProps) => {
    const dispatch = useAppDispatch();
    const data = useAppSelector(selectData);
    const server = useAppSelector((state) => selectServerById(state, id));

    const performanceGenerator = useMemo(() => new ServerPerformance(), []);

    useEffect(() => {
        if (!server || !server.online) return;
        // todo: fetch data in interval, using redux thunk
        const timer = setInterval(() => {
            //setCPU((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
            dispatch(
                setData(JSON.parse(JSON.stringify(performanceGenerator.update())))
            );
        }, 800);

        return () => {
            clearInterval(timer);
        };
    }, [dispatch, performanceGenerator, server]);

    if (!data || !isUsageData(data))
        return (
            <Typography variant="h1" fontSize={30}>
                Fetching data...
            </Typography>
        );

    const {
        cpuUsage: cpu,
        ramUsage: ram,
        diskUsage: disk,
        networkUsage: network,
    } = data as UsageData;

    const renderCPU = (
        <UsageStatus
            section="CPU"
            caption={`${cpu}%`}
            value={cpu}
            color={cpu > 90 ? "error" : cpu > 75 ? "warning" : "success"}
        />
    );

    const renderRAM = (
        <UsageStatus
            section="RAM"
            caption={`${ram}%`}
            value={ram}
            color={ram > 90 ? "error" : ram > 75 ? "warning" : "success"}
        />
    );

    const renderDisk = (
        <UsageStatus
            section="Disk"
            caption={`${disk}%`}
            value={disk}
            color={disk > 90 ? "error" : disk > 75 ? "warning" : "success"}
        />
    );

    const renderNetwork = (
        <UsageStatus
            section="Network"
            caption={`${network}%`}
            value={network}
            color="primary"
        />
    );

    return (
        <Grid container spacing={2} maxWidth="500px">
            <Grid item xs={12}>
                <Typography variant="h1" fontSize={22}>
                    Performance Usage
                </Typography>
            </Grid>
            <Grid item xs={6}>
                {renderCPU}
            </Grid>
            <Grid item xs={6}>
                {renderRAM}
            </Grid>
            <Grid item xs={6}>
                {renderDisk}
            </Grid>
            <Grid item xs={6}>
                {renderNetwork}
            </Grid>
        </Grid>
    );
};

export default Usage;
