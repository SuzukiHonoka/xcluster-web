import {useAppSelector} from "../app/hook.ts";
import {selectIsAuthenticated} from "../features/auth/authSlice.ts";
import {Navigate} from "react-router-dom";
import React from "react";

interface AuthRequiredProps {
    element: React.ReactElement;
    to: string;
}

const AuthRequired = ({element, to}: AuthRequiredProps) => {
    const auth = useAppSelector(selectIsAuthenticated);

    return <>{auth ? element : <Navigate to={to}/>}</>;
};

export default AuthRequired;
