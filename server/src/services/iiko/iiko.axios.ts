import { iiko } from "src/services/iiko/interfaces";
import { Injectable } from "@nestjs/common";
import { Axios } from "src/common/abstracts/request";
import { AxiosInstance } from "axios";
import { IikoError } from "./iiko.error";

@Injectable()
export class IIkoAxios extends Axios {
    public _axios: AxiosInstance;

    constructor() {
        super(
            process.env.SERVICE_URL,
            (error) =>
                new IikoError(
                    error.response?.data?.description ||
                        error.response?.data?.message
                )
        );
    }

    // private init() {
    //     this.axios = axios.create({
    //         baseURL: process.env.SERVICE_URL
    //     });

    //     this.axios.interceptors.response.use(
    //         (response) => response,
    //         (error) => {
    //             console.log(error);
    //             return Promise.reject(
    //                 new IikoError(
    //                     error.response.data?.description ||
    //                         error.response.data?.message
    //                 )
    //             );
    //         }
    //     );
    // }

    private async token() {
        const { data } = await this._axios.get<string>(
            `/api/0/auth/access_token?user_id=${process.env.SERVICE_LOGIN}&user_secret=${process.env.SERVICE_PASSWORD}`
        );

        return data;
    }

    public async orderTypes(organization) {
        const token = await this.token();
        const { data } = await this._axios.get<OrderTypesIiko>(
            `/api/0/rmsSettings/getOrderTypes?access_token=${token}&organization=${organization}`
        );

        return data;
    }

    public async orderCreate(orderData: iiko.IOrderBody) {
        const token = await this.token();
				
        const { data } = await this._axios.post<OrderInfoIiko>(
            `/api/0/orders/add?access_token=${token}`,
            orderData
        );
				console.log('orderCreate',data);
        return data;
    }

    public async checkOrder(orderData: iiko.IOrderBody) {
        const token = await this.token();

        const { data } = await this._axios.post<OrderCheckCreationResult>(
            `/api/0/orders/checkCreate?access_token=${token}`,
            orderData
        );

        return data;
    }

    public async stopList(organization: UniqueId) {
        const token = await this.token();
        const { data } = await this._axios.get<iiko.IStopListBody>(
            `/api/0/stopLists/getDeliveryStopList?access_token=${token}&organization=${organization}`
        );

        return data;
    }

		public async discontList(body:any) {
			const token = await this.token();
			
			/**/
			const { data } = await this._axios.post<any>(
				`/api/0/orders/calculate_checkin_result?access_token=${token}`,
				body
			);
			
			return data
	}
}

export const iikoAxiosProviders = [
    {
        provide: "IIKO_AXIOS",
        useFactory: () => new IIkoAxios()
    }
];
