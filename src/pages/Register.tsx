import { useAuth } from "../hooks/AuthProvider";
import { FormEvent, useState } from "react";
import { SnackBarSeverityLevel } from "../utils/enum";
import { RegisterData, SnackbarInterface } from "../utils/interface";
import { Alert, Card, CardContent, CircularProgress, Snackbar, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios, { AxiosResponse } from "axios";
import { ApiConstants } from "../utils/api-constants";
import axiosHttp from "utils/axios-index";
export default function Register() {
    const authContext = useAuth();
    const [errors, setErrors] = useState<{ passwordMatch?: string }>({});
    const [formData, setFormData] = useState<RegisterData>({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: ""

    })

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarInterface>({
        message: "",
        severity: SnackBarSeverityLevel.WARNING,
        vertical: "top",
        horizontal: "center",
        open: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const updatedData = { ...prevData, [name]: value };
            if (name === 'password' || name === 'confirmPassword') {
                const { password, confirmPassword } = updatedData;
                if (password && confirmPassword && password !== confirmPassword) {
                    setErrors({ passwordMatch: 'Passwords do not match' });
                } else {
                    setErrors({});
                }
            }

            return updatedData;
        });
    };

    const validatePasswords = () => {
        if (formData.password !== formData.confirmPassword) {
            setErrors({ passwordMatch: 'Passwords do not match' });
            return false;
        } else {
            setErrors({});
            return true;
        }
    };

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
                            message: "Registerd successfully!",
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
            if (validatePasswords()) {
                delete formData.confirmPassword;
                axiosHttp.post(ApiConstants.accounts.register, formData)
                    .then((res: AxiosResponse) => {
                        setSnackbar({
                            ...snackbar,
                            open: true,
                            message: "Registerd successfully!",
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
                            message: "Email Already Exists!. Please try again.",
                            severity: SnackBarSeverityLevel.WARNING,
                        });
                        setLoading(prevState => !prevState);
                        setFormData({ password: '', confirmPassword: '', email: '', firstName: '', lastName: '' });
                    })
            }
            else {
                setErrors({ passwordMatch: 'Passwords do not match' });
                setLoading(prevState => !prevState);
            }
        }
        catch (err) {
        }


    }

    return <>
        <section className="min-h-[87svh] container overflow-hidden -mt-4">
            <div className="px-3 lg:px-64 h-[85svh] flex flex-col justify-center items-center  overflow-hidden" >
                <h1 className="text-3xl text-start text-blue-800 mb-3">Register</h1>
                <Card className="!rounded-xl !shadow-lg border border-blue-900 md:mx-3">
                    <CardContent>
                        <div className="px-4  md:px-10 lg:px-12 py-8">

                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="mb-3">
                                    <TextField value={formData.firstName} onChange={handleChange}
                                        name="firstName"
                                        className="w-96" label="First Name" placeholder="Enter First Name"
                                        type="text"></TextField>
                                </div>
                                <div className="mb-3">
                                    <TextField value={formData.lastName} onChange={handleChange}
                                        name="lastName"
                                        className="w-96" label="Last Name" placeholder="Enter Last Name"
                                        type="text"></TextField>
                                </div>

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
                                    <TextField value={formData.confirmPassword} onChange={handleChange}
                                        name="confirmPassword"
                                        className="w-96" label="Confirm Password" placeholder="Confirm Password here"
                                        error={!!errors.passwordMatch}
                                        helperText={errors.passwordMatch}
                                        type="password"></TextField>
                                </div>
                                <div className="mb-3">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-96 flex justify-center gap-3 items-center px-6 py-4 bg-blue-800 rounded text-white hover:shadow-lg transition">
                                        Sign Up {loading ? <CircularProgress size={16} color="inherit" /> : null}
                                    </button>
                                </div>
                            </form>
                            <p className="text-center mb-3">Already have an account? <Link
                                className="text-blue-500 hover:underline transition" to="/login">Login</Link>
                            </p>
                            <button onClick={() => { login() }} className="w-50 flex justify-center mx-auto items-center px-6 py-4 bg-blue-800 rounded text-white hover:shadow-lg transition">SignUp with Google </button>


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