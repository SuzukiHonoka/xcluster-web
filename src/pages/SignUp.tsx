import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import {Navigate, Link as RouterLink, useNavigate} from "react-router-dom";
import {useForm, SubmitHandler} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useAlert, useAppDispatch, useAppSelector} from "../app/hook";
import {selectIsAuthenticated} from "../features/auth/authSlice";
import {
    resetStatus,
    selectError,
    selectStatus,
    userRegister,
} from "../features/register/registerSlice";
import {useEffect} from "react";

const InputProps = {
    sx: {
        borderRadius: "12px",
    },
};

type Inputs = {
    email: string;
    name: string;
    password: string;
    passwordConfirmation: string;
};

export default function SignUp() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const alert = useAlert();

    const auth = useAppSelector(selectIsAuthenticated);
    const registerError = useAppSelector(selectError);
    const registerStatus = useAppSelector(selectStatus);

    useEffect(() => {
        console.log("signup(registerStatus):", registerStatus);
        if (["idle", "loading"].includes(registerStatus)) return;
        if (registerStatus === "succeeded") {
            alert("Registration success");
            navigate("/login", {
                replace: true,
            });
        } else if (registerStatus === "failed") {
            alert(`Registration Error: ${registerError}`, "error");
        }
        // reset registration state
        return () => {
            dispatch(resetStatus());
        };
    }, [registerStatus, alert, dispatch, navigate, registerError]);

    const schema = yup.object({
        email: yup.string().required().email(),
        name: yup.string().required(),
        password: yup.string().required().min(8),
        // !!IMPORTANT: MUST ADD FOLLOWING VALIDATORS IN PRODUCTION BUILD
        // .matches(
        //     // At least one letter, one number and one special character:
        //     ///^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].*$/,
        //     // At least one letter, one number:
        //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d].*$/,
        //     "Password should contain at least one letter, one number."
        // ),
        passwordConfirmation: yup
            .string()
            .required()
            .test((value, ctx) => {
                if (value !== getValues("password")) {
                    return ctx.createError({message: "password not equal"});
                }
                return true;
            }),
    });

    const {
        register,
        getValues,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        dispatch(userRegister(data));
    };

    const renderSignup = (
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
                    Sign up
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{mt: 3}}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                required
                                InputProps={InputProps}
                                fullWidth
                                id="name"
                                label="Name"
                                autoComplete="name"
                                {...register("name")}
                                error={"name" in errors}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                InputProps={InputProps}
                                fullWidth
                                id="email"
                                label="Email Address"
                                autoComplete="email"
                                {...register("email")}
                                error={"email" in errors}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                InputProps={InputProps}
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                {...register("password")}
                                error={"password" in errors}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                InputProps={InputProps}
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                id="passwordConfirmation"
                                autoComplete="new-password"
                                {...register("passwordConfirmation")}
                                error={"passwordConfirmation" in errors}
                                helperText={errors.passwordConfirmation?.message}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        disabled={registerStatus === "loading"}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2, borderRadius: "12px"}}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link
                                sx={{
                                    color: "primary.main",
                                    textDecoration: "none",
                                }}
                                component={RouterLink}
                                to="/login"
                                variant="body2"
                            >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
    return <>{auth ? <Navigate to="/dashboard" replace/> : renderSignup}</>;
}
