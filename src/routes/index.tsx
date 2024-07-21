import { lazy, Suspense } from "react";
import Loading from "../pages/Loading";
import { RouteObject } from "react-router-dom";
import AuthorizedRoute from "./AuthorizedRoute";

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
(
    <Suspense fallback={<Loading />}>
        <Component {...props} />
    </Suspense>
);
const Login = Loadable(lazy(() => import('../pages/Login')));
const Register = Loadable(lazy(() => import('../pages/Register')));
const Dashboard = Loadable(lazy(() => import('../pages/Dashboard/index')));
const routes: RouteObject[] = [
    {
        path: '/',
        index: true,
        element: <Login />
    },
    {
        path: '/login',
        index: true,
        element: <Login />
    },
    {
        path: '/register',
        index: true,
        element: <Register />
    },

    {
        path: "boards",
        element: <AuthorizedRoute />,
        children: [
            {
                path: "",
                element: <Dashboard />
            }
        ]
    },
]
export default routes;