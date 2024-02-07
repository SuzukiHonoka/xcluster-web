import {Button, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {PluginProps} from "../PluginTabs";
import {useAlert, useAppSelector, useDialog} from "../../app/hook";
import {selectServerById} from "../../features/server/serverSlice";
import {generateRandomString} from "../../utils/random";
import {useEffect, useState} from "react";

const Access = ({id}: PluginProps) => {
    const dialog = useDialog();
    const alert = useAlert();
    const server = useAppSelector((state) => selectServerById(state, id));
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (password === "") return;
        dialog(
            "Remember Your New Password",
            `Your new root password is: ${password}`,
            () => {
                alert("Root password changed!", "success");
            }
        );
        return () => {
            setPassword("");
        };
    }, [alert, dialog, password]);

    const handleReset = () => {
        const randomPassword = generateRandomString();

        console.log("randomPassword: ", randomPassword);
        setPassword(randomPassword);
    };

    const askReset = () => {
        dialog(
            "Confirm Reset Password",
            "Are you sure you want to reset your root password?",
            handleReset
        );
    };

    if (!server) return <Typography variant="h1"> SERVER NOT FOUND</Typography>;
    return (
        <Grid container spacing={2} maxWidth="500px">
            <Grid item xs={12}>
                <Typography variant="h1" fontSize={22} color="text.primary">
                    Forgot your root password?
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={askReset}>
                    Reset Password
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h1" fontSize={22} color="text.primary">
                    SSH Information
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" fontSize={20} color="text.primary">
                            Host
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" fontSize={20} color="text.primary">
                            Port
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" fontSize={15} color="text.primary">
                            {server?.ip ?? "N/A"}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" fontSize={15} color="text.primary">
                            22
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Access;
