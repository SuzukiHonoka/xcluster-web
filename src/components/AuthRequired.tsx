import { useAppSelector } from "../app/hook.ts";
import { selectIsAuthenticated } from "../features/auth/authSlice.ts";
import { Navigate, useLocation } from "react-router-dom";
import React from "react";

const defaultTo = "/login";

interface AuthRequiredProps {
  element?: React.ReactElement;
  to?: string;
}

const AuthRequired = ({ element, to }: AuthRequiredProps) => {
  const auth = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  return auth ? (
    element
  ) : (
    <Navigate to={to ?? defaultTo} state={{ from: location }} />
  );
};

export default AuthRequired;
