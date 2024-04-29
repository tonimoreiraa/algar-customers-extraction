import axios from "axios";

export const createApi = (cookie: string) => {
    return axios.create({
        baseURL: process.env.ALGARCRM_API,
        headers: {
            Cookie: cookie,
        }
    })
}