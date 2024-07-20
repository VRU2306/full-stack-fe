import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../hooks/AuthProvider";

export default function AuthorizedRoute() {
    const user = useAuth();
    if (!user.token) return <Navigate to="/" />;

    return <Outlet />;
}