import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { Bot } from "./interfaces";
import { ServiceUnavailableException } from "@nestjs/common";

@Injectable()
export class BotAxios {
    private axios: AxiosInstance;

    constructor() {
        this.init();
    }

    private init() {
        this.axios = axios.create({
            baseURL: process.env.BOT_URL,
						headers: {
					    Authorization : `Bearer ${process.env.BOT_TOKEN}`
					    }
        });

        this.axios.interceptors.response.use(
            (response) => response,
            (error) => {
                throw new ServiceUnavailableException();
            }
        );
    }

    async sendDuplicate(
        organization: UniqueId,
        data: Bot.IRequestBody
    ): Promise<void> {
        if (process.env.BOT_ACTIVE_FLAG !== "false") {
            this.axios.post(`/sendDuplicate/${organization}`, data);
        }
    }
    async reserveTable(
        organization: UniqueId,
        data: Bot.IRequestBodyReserve
    ) {
        this.axios.post(`/reserveTable/${organization}`, data);
    }
}

export const BotAxiosProvider = {
    provide: "BOT_AXIOS",
    useClass: BotAxios
};
