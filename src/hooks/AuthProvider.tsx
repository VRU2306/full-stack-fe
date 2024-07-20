import { createContext, useContext, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Profile } from "../utils/interface";
const AuthContext = createContext({
    token: "",
    user: {}
} as any);
const AuthProvider = ({ children }: { children: any }) => {
    const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("accessToken") !== null ? true : false)
    const [user, setUser] = useState<Profile>();
    const navigate = useNavigate();
    // const loginAction = (formData: LoginRequest) => {
    //     return axiosHttp.post(ApiConstants.accounts.login, formData);
    // };

    const logOut = () => {
        setToken("");
        setUser({} as Profile);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("profileData");
        navigate("/login");
    };

    // const getUserInfo = () => {
    //     let userData = localStorage.getItem("profileData");
    //     if (userData) {
    //         setUser(JSON.parse(userData));
    //         return JSON.parse(userData);
    //     }
    //     else
    //         return user as ProfileDataInterface;
    // }

    // const updateUserInfo = (data: ProfileDataInterface) => {
    //     let userData = getUserInfo();
    //     if (userData)
    //         data = Object.assign(userData, data);
    //     setUser(data);
    //     return user;
    // }


    const contextValue = useMemo(() => ({
        token, user, isLoggedIn, setToken, setIsLoggedIn, setUser, logOut
    }), [token, user, isLoggedIn, setToken, setUser, setIsLoggedIn, logOut]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};