export const ApiConstants = {
    baseApiUrl: "https://be.codingjudge.com/",
    accounts: {
        register: "api/auth/register/",
        login: "api/auth/login/",
        googleSignIn: "api/auth/google-register/",

    },
    googleAccessToken: (access_token: string) => `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`

}