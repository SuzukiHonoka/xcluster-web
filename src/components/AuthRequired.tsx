import { useAppSelector } from "../app/hook.ts";
import { selectIsAuthenticated } from "../features/auth/authSlice.ts";
import { Navigate } from "react-router-dom";

interface AuthRequiredProps {
  element: JSX.Element;
  to: string;
}

const AuthRequired = ({ element, to }: AuthRequiredProps) => {
  const auth = useAppSelector(selectIsAuthenticated);

  return <>{auth ? element : <Navigate to={to} />}</>;
};

export default AuthRequired;
