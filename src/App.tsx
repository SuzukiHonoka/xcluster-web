import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/dashboard/Home.tsx";
import "./App.css";
import PageNotFound from "./pages/PageNotFound";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import AuthRequired from "./components/AuthRequired.tsx";
import { useAppDispatch, useAppSelector } from "./app/hook.ts";
import {
  selectRemember,
  userRecovery,
  userLogout,
  reset,
  selectIsAuthenticated,
} from "./features/auth/authSlice.ts";
import { request } from "./app/api.ts";
import { useState, useEffect, useMemo, useRef } from "react";
import { APIResponse } from "./models/api.ts";
import ServerGrid from "./pages/dashboard/ServerGrid.tsx";
import ServerControl from "./pages/dashboard/ServerControl.tsx";
import UserManage from "./pages/dashboard/UserManage.tsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isMountingRef = useRef(true);

  const auth = useAppSelector(selectIsAuthenticated);
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
          // enforcing redirect, provide the state so that user can go back
          navigate("/login", {
            state: { from: location },
          });
        }
        return Promise.reject(error);
      }
    );
  }, [dispatch, location, navigate]);

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
      isMountingRef.current = false;
    };
  }, [dispatch, shouldRecoveryUserState]);

  // Trigger user logout if page is going to be unloaded (refresh)
  useEffect(() => {
    const handleLogout = () => {
      if (!auth) return;
      if (!shouldRecoveryUserState) dispatch(userLogout());
    };
    window.addEventListener("beforeunload", handleLogout);
    return () => {
      window.removeEventListener("beforeunload", handleLogout);
    };
  }, [auth, dispatch, shouldRecoveryUserState]);

  const renderRoutes = (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<SignUp />} />
        <Route path="dashboard" element={<AuthRequired element={<Outlet />} />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path="server" element={<ServerGrid />} />
          <Route path="server/:id" element={<ServerControl />} />
          <Route path="user" element={<UserManage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );

  return <> {!wait && renderRoutes}</>;
}

export default App;
