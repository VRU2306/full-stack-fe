export const ApiConstants = {
    baseApiUrl: "http://localhost:4500/",
    accounts: {
        register: "api/auth/register/",
        login: "api/auth/login/",
        googleSignIn: "api/auth/google-register/",

    },
    googleAccessToken: (access_token: string) => `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
    tasks: {
        add: "api/task/tasks",
        get: (userId: string) => `api/task/tasks?userId=${userId}`,
        getById: (id: string) => `api/task/tasks/${id}`,
        updateById: (id: string) => `api/task/tasks/${id}`,
        deleteById: (id: string) => `api/task/tasks/${id}`
    }

}