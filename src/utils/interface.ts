import { SnackBarSeverityLevel } from "./enum"

export interface Profile {
    name: string,
    email: string,

}
export interface LoginData {
    email: string,
    password: string
}
export interface ProfileData {
    email: string,
    name: string,
    picture: string,
    googleSignIn: boolean
}

export interface SnackbarInterface {
    message: string,
    severity: SnackBarSeverityLevel,
    vertical: "top" | "bottom",
    horizontal: "center" | "left" | "right",
    open: boolean
}
