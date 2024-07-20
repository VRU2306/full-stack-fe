import axios from "axios";
import { ApiConstants } from "./api-constants";

const axiosHttp = axios.create({
    baseURL: `${ApiConstants.baseApiUrl}`,
});

axiosHttp.interceptors.request.use(
    (config: any) => {
        if (config.url.includes("api/auth/login") || config.url.includes("api/auth/register") || config.url.includes("api/auth/google-register/")) {
            return config;
        }
        let token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosHttp.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401 || error.response.status === 403) {
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosHttp;