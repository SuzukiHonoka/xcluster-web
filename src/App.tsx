import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard.tsx";
import "./App.css";
import PageNotFound from "./pages/PageNotFound";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import AuthRequired from "./components/AuthRequired.tsx";
import { useAppDispatch } from "./app/hook.ts";
import { setExpired } from "./features/auth/authSlice.ts";
import { request } from "./app/api.ts";

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  request.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error("apiRequest.interceptors:", error);
      if (error.response?.status === 401) {
        dispatch(setExpired());
        // enforcing redirect
        navigate("/login", {
          replace: true,
        });
      }
      return Promise.reject(error);
    }
  );

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<SignUp />} />
        <Route
          path="dashboard"
          element={<AuthRequired to="/login" element={<Dashboard />} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
