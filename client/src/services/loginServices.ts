import { IUser } from "../types/loginTypes";
import axios, { AxiosPromise } from "axios";

const loginRequest = (user: IUser, url: string): AxiosPromise =>
    axios.post(`${ url }/login`, {
        username: user.username,
        password: user.password
    })

export {
    loginRequest
}
