import { createContext, useContext, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Profile } from "../utils/interface";
import { googleLogout } from "@react-oauth/google";
const AuthContext = createContext({
    token: "",
    user: {}
} as any);
const AuthProvider = ({ children }: { children: any }) => {
    const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("accessToken") !== null ? true : false)
    const [user, setUser] = useState<Profile>();
    const navigate = useNavigate();


    const logOut = () => {
        const user = getUserInfo()
        if (user?.googleSignedInUser === true) {
            googleLogout()
        }
        setToken("");
        setUser({} as Profile);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("profileData");
        navigate("/login");
    };

    const getUserInfo = () => {
        let userData = localStorage.getItem("profileData");
        if (userData) {
            setUser(JSON.parse(userData));
            return JSON.parse(userData);
        }
        else
            return user as Profile;
    }

    const contextValue = useMemo(() => ({
        token, user, isLoggedIn, setToken, setIsLoggedIn,getUserInfo, setUser, logOut
    }), [token, user, isLoggedIn, setToken, setUser,getUserInfo, setIsLoggedIn, logOut]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};