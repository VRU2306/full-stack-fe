import { useAuth } from "../hooks/AuthProvider";
import { FormEvent, useEffect, useState } from "react";
import { SnackBarSeverityLevel } from "../utils/enum";
import { LoginData, ProfileData, SnackbarInterface } from "../utils/interface";
import { Alert, Card, CardContent, CircularProgress, Snackbar, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
export default function Login() {
    const authContext = useAuth();
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: ""
    })

    const [profileData, setProfileData] = useState<ProfileData>({
        email: "",
        name: "",
        picture: "",
        googleSignIn: true
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
    }, []);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${codeResponse.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    // setProfile(res.data);
                    setProfileData(res.data)
                    window.location.href = "/home"
                    console.log(res.data)
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
        // throw new Error("Function not implemented.");
        // login data
    }

    return <>
        <section className="min-h-[70svh] container">
            <div className="px-4 lg:px-96 h-[70svh] flex flex-col justify-center " >
                <Card className="!rounded-xl !shadow-lg border border-blue-900">
                    <CardContent>
                        <div className="px-3 md:px-10 lg:px-12 py-10">
                            <h1 className="text-3xl text-center mb-5">Login</h1>
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="mb-5">
                                    <TextField value={formData.email} onChange={handleChange}
                                        name="email"
                                        className="w-full" label="Email" placeholder="Enter Email here"
                                        type="email"></TextField>
                                </div>
                                <div className="mb-5">
                                    <TextField value={formData.password} onChange={handleChange}
                                        name="password"
                                        className="w-full" label="Password" placeholder="Enter Password here"
                                        type="password"></TextField>
                                </div>
                                <div className="mb-3">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full flex justify-center gap-3 items-center px-6 py-4 bg-blue-800 rounded text-white hover:shadow-lg transition">
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