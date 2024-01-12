import {Grid} from "@mui/material";
import {useState, useEffect} from "react";
import {PluginProps} from "../PluginTabs";
import UsageStatus from "./UsageStatus";

const Usage = ({id}: PluginProps) => {
    // todo: fetch infos by id
    const [cpu, setCPU] = useState(0);

    useEffect(() => {
        // todo: fetch data in interval, using redux thunk
        const timer = setInterval(() => {
            setCPU((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);

        return () => {
            clearInterval(timer);
        };
    }, []);

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
            caption={`${cpu}/100 MB`}
            value={cpu}
            color={cpu > 90 ? "error" : cpu > 75 ? "warning" : "success"}
        />
    );

    const renderDisk = (
        <UsageStatus
            section="Disk"
            caption={`${cpu}/100 GB`}
            value={cpu}
            color={cpu > 90 ? "error" : cpu > 75 ? "warning" : "success"}
        />
    );

    const renderNetwork = (
        <UsageStatus
            section="Network"
            caption={`${cpu} Mbps`}
            value={cpu}
            color="primary"
        />
    );

    return (
        <Grid container spacing={2} maxWidth="500px">
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
