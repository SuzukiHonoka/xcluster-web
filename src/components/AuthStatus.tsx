import {useEffect} from 'react';
import {useAlert, useAppDispatch, useAppSelector} from "../app/hook.ts";
import {resetStatus, selectError, selectIsAuthenticated, selectStatus} from "../features/auth/authSlice.ts";
import {useNavigate} from "react-router-dom";

const AuthStatus = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const alert = useAlert();

    const auth = useAppSelector(selectIsAuthenticated);
    const authError = useAppSelector(selectError);
    const authStatus = useAppSelector(selectStatus);

    useEffect(() => {
        console.log("authStatus:", authStatus);
        // show failed errors
        if (authStatus === "failed") {
            alert(`Authentication Error: ${authError!}`, "error");
            console.log("auth failed:", authError);
        } else if (authStatus === "succeeded") {
            console.log("auth:", auth);
            if (typeof auth === "undefined") {
                return;
            }
            if (auth) {
                alert("Welcome Back!");
            } else {
                alert("Logged Out");
                navigate("/login", {
                    replace: true,
                });
            }
        }
        // clear authStatus
        return () => {
            dispatch(resetStatus())
        }
    }, [authStatus, alert, authError, auth, navigate, dispatch]); // note: navigate will cause re-activate useEffect
    return null;
};

export default AuthStatus;