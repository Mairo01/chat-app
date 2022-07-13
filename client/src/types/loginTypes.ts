interface IUser {
    username: string
    password: string
}

interface ILogin {
    username: string
    userID: string
    token: string
}

export type {
    IUser,
    ILogin
}