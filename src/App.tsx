import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard.tsx";
import "./App.css";
import PageNotFound from "./pages/PageNotFound";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import AuthRequired from "./components/AuthRequired.tsx";
import {useAppDispatch, useAppSelector} from "./app/hook.ts";
import {
    selectRemember,
    userRecovery,
    userLogout,
    reset, selectIsAuthenticated,
} from "./features/auth/authSlice.ts";
import {request} from "./app/api.ts";
import {useState, useEffect, useMemo, useRef} from "react";
import {APIResponse} from "./models/api.ts";

function App() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isMountingRef = useRef(true)

    const auth = useAppSelector(selectIsAuthenticated)
    const shouldRecoveryUserState = useAppSelector(selectRemember);
    const [wait, setWait] = useState(shouldRecoveryUserState);

    // Catch all API errors
    useMemo(() => {
        request.interceptors.response.use(
            (response) => {
                // check if data empty
                if (!response.data) {
                    return Promise.reject(new Error("API response with a empty data"));
                }
                // api status code
                if ((response.data as APIResponse).code !== 200) {
                    return Promise.reject(
                        new Error(response.data.message ?? "unknown error")
                    );
                }
                return response;
            },
            (error) => {
                //console.error("apiRequest.interceptors:", error);
                if (error.response?.status === 401) {
                    dispatch(reset());
                    // enforcing redirect
                    navigate("/login", {
                        replace: true,
                    });
                }
                return Promise.reject(error);
            }
        );
    }, [dispatch, navigate]);

    // Conditionally trigger user recovery
    useEffect(() => {
        (async () => {
            if (isMountingRef.current && shouldRecoveryUserState) {
                console.log("app: trigger user recovery");
                await dispatch(userRecovery());
                setWait(false);
            }
        })();
        return () => {
            isMountingRef.current = false
        }
    }, [dispatch, shouldRecoveryUserState]);

    // Trigger user logout if page is going to be unloaded (refresh)
    useEffect(() => {
        const handleLogout = () => {
            if (!auth) return
            if (!shouldRecoveryUserState) dispatch(userLogout());
        };
        window.addEventListener("beforeunload", handleLogout);
        return () => {
            window.removeEventListener("beforeunload", handleLogout);
        };
    }, [auth, dispatch, shouldRecoveryUserState]);

    const renderRoutes = (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Navigate to="/dashboard" replace/>}/>
                <Route path="login" element={<SignIn/>}/>
                <Route path="register" element={<SignUp/>}/>
                <Route
                    path="dashboard"
                    element={<AuthRequired to="/login" element={<Dashboard/>}/>}
                />
                <Route path="*" element={<PageNotFound/>}/>
            </Route>
        </Routes>
    );

    return <> {!wait && (renderRoutes)}</>;
}

export default App;
