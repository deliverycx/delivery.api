import axios, { AxiosInstance } from "axios";

export abstract class Axios {
    public _axios: AxiosInstance;

    constructor(
        private readonly baseUrl: string,
        private readonly errorCallback?: any
    ) {
        this.init();
    }

    private init() {
        this._axios = axios.create({
            baseURL: this.baseUrl
        });

        this._axios.interceptors.response.use(
            (response) => response,
            (error) => {
                console.log(error);
                return Promise.reject(this.errorCallback(error));
            }
        );
    }
}
