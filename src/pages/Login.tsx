import { useAuth } from "../hooks/AuthProvider";
import { FormEvent, useEffect, useState } from "react";
import { SnackBarSeverityLevel } from "../utils/enum";
import { LoginData, SnackbarInterface } from "../utils/interface";
import { Alert, Card, CardContent, CircularProgress, Snackbar, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios, { AxiosResponse } from "axios";
import { ApiConstants } from "../utils/api-constants";
import axiosHttp from "utils/axios-index";
export default function Login() {
    const authContext = useAuth();
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarInterface>({
        message: "",
        severity: SnackBarSeverityLevel.WARNING,
        vertical: "top",
        horizontal: "center",
        open: false
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }
    useEffect(() => {
        authContext.logOut();
        // eslint-disable-next-line
    }, []);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            axios
                .get(ApiConstants.googleAccessToken(codeResponse.access_token as string), {
                    headers: {
                        Authorization: `Bearer ${codeResponse.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res: AxiosResponse) => {
                    let obj = {
                        email: res.data.email,
                        name: res.data.name
                    }
                    axiosHttp.post(ApiConstants.accounts.googleSignIn, obj).then((res: AxiosResponse) => {
                        setSnackbar({
                            ...snackbar,
                            open: true,
                            message: "Logged in successfully!",
                            severity: SnackBarSeverityLevel.SUCCESS,
                        });
                        authContext.setToken(res.data.token);
                        localStorage.setItem("accessToken", res.data.token);
                        delete res.data.token;
                        authContext.setUser(res.data);
                        localStorage.setItem("profileData", JSON.stringify(res.data));
                        window.location.href = "/boards"
                    })
                        .catch((err: AxiosResponse) => {
                            setSnackbar({
                                ...snackbar,
                                open: true,
                                message: "Authentication credentials invalid. Please try again.",
                                severity: SnackBarSeverityLevel.WARNING,
                            });
                            setLoading(prevState => !prevState);
                        })

                })
                .catch((err) => console.log(err));
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbar({
            ...snackbar,
            open: false
        })
    };
    function handleSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        setLoading(prevState => !prevState);
        try {
            axiosHttp.post(ApiConstants.accounts.login, formData)
                .then((res: AxiosResponse) => {
                    setSnackbar({
                        ...snackbar,
                        open: true,
                        message: "Logged in successfully!",
                        severity: SnackBarSeverityLevel.SUCCESS,
                    });
                    authContext.setToken(res.data.token);
                    localStorage.setItem("accessToken", res.data.token);
                    delete res.data.token;
                    authContext.setUser(res.data);
                    localStorage.setItem("profileData", JSON.stringify(res.data));
                    window.location.href = "/boards"
                })
                .catch((err: AxiosResponse) => {
                    setSnackbar({
                        ...snackbar,
                        open: true,
                        message: "Authentication credentials invalid. Please try again.",
                        severity: SnackBarSeverityLevel.WARNING,
                    });
                    setLoading(prevState => !prevState);
                })
        }
        catch (err) {
            console.log(err, 76)
        }

    }

    return <>
        <section className="min-h-[70svh] container overflow-hidden -mt-4">
            <div className="px-3 lg:px-64 h-[73svh] flex flex-col justify-center items-center  overflow-hidden" >
                <h1 className="text-3xl text-start text-blue-800 mb-3">Login</h1>
                <Card className="!rounded-xl !shadow-lg border border-blue-900 md:mx-3">
                    <CardContent>
                        <div className="px-4  md:px-10 lg:px-12 py-8">

                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="mb-3">
                                    <TextField value={formData.email} onChange={handleChange}
                                        name="email"
                                        className="w-96" label="Email" placeholder="Enter Email here"
                                        type="email"></TextField>
                                </div>
                                <div className="mb-3">
                                    <TextField value={formData.password} onChange={handleChange}
                                        name="password"
                                        className="w-96" label="Password" placeholder="Enter Password here"
                                        type="password"></TextField>
                                </div>
                                <div className="mb-3">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-96 flex justify-center gap-3 items-center px-6 py-4 bg-blue-800 rounded text-white hover:shadow-lg transition">
                                        Login {loading ? <CircularProgress size={16} color="inherit" /> : null}
                                    </button>
                                </div>
                            </form>
                            <p className="text-center mb-3">Don't have an account? <Link
                                className="text-blue-500 hover:underline transition" to="/register">Sign Up</Link>
                            </p>
                            <button onClick={() => { login() }} className="w-50 flex justify-center mx-auto items-center px-6 py-4 bg-blue-800 rounded text-white hover:shadow-lg transition">Login with Google </button>


                        </div>

                    </CardContent>
                </Card>

            </div>
            <Snackbar anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }} open={snackbar.open} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </section>
    </>
}