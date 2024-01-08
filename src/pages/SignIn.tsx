import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import * as yup from "yup";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useAppDispatch, useAppSelector} from "../app/hook.ts";
import {
    selectIsAuthenticated,
    selectStatus,
    setRemember,
    userLogin,
} from "../features/auth/authSlice.ts";
import {useEffect, useState} from "react";

const InputProps = {
    sx: {
        borderRadius: "12px",
    },
};

type Inputs = {
    email: string;
    password: string;
};

export default function SignIn() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [rememberChecked, setRememberChecked] = useState(false);
    const auth = useAppSelector(selectIsAuthenticated);
    const authStatus = useAppSelector(selectStatus);

    useEffect(() => {
        console.log("signing(auth):", auth);
        if (auth) navigate("/");
    }, [auth, navigate]);


    const schema = yup.object({
        email: yup.string().required().email(),
        password: yup.string().required().min(8),
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        dispatch(setRemember(rememberChecked));
        dispatch(userLogin(data));
    };

    return (
        <Box
            sx={{
                width: {xs: "auto", sm: "390px"},
                mx: "auto",
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    borderRadius: "12px",
                    py: "15px",
                    px: "30px",
                    mx: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{mt: 1}}
                >
                    <TextField
                        autoFocus
                        InputProps={InputProps}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        {...register("email")}
                        error={"email" in errors}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        InputProps={InputProps}
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register("password")}
                        error={"password" in errors}
                        helperText={errors.password?.message}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                value="remember"
                                color="primary"
                                checked={rememberChecked}
                                onChange={(event) => setRememberChecked(event.target.checked)}
                            />
                        }
                        label="Remember me"
                    />
                    <Button
                        disabled={authStatus === "loading"}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link hidden href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                sx={{
                                    color: "primary.main",
                                    textDecoration: "none",
                                }}
                                component={RouterLink}
                                to="/register"
                                variant="body2"
                            >
                                {"Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}
