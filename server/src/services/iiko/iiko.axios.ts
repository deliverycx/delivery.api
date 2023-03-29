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
            process.env.TRANSFER_URL,
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
        const { data } = await this._axios.post<{token:string}>(
            `/access_token`,
						{
							apiLogin: "539ecfae"
						}
        );
				
        return data.token;
    }

    public async orderTypes(organization) {
        const token = await this.token();
        const { data } = await this._axios.post<OrderTypesIiko>(
            `/deliveries/order_types`,
						{
							organizationIds: [
								organization
							]
						},
						{
							headers: { Authorization: `Bearer ${token}` }
						}
        );



        return data;
    }

		public async termiralGroops(organization:string) {
			const token = await this.token();
			const { data } = await this._axios.post<any>(
					`/terminal_groups`,
					{
						organizationIds: [
							organization
						],
						includeDisabled: true
					},
					{
						headers: { Authorization: `Bearer ${token}` }
					}
			);



			return data.terminalGroups[0].items[0].id;
		}

    public async orderCreateDelivery(orderData: any) {
        const token = await this.token();

        const { data } = await this._axios.post(
            `/deliveries/create`,
            orderData,
						{
							headers: { Authorization: `Bearer ${token}` }
						}
        );


        return data.orderInfo;
    }

		public async orderCreate(orderData: any) {
			const token = await this.token();

			const { data } = await this._axios.post(
					`/order/create`,
					orderData,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
			);


			return data.orderInfo;
	}

		public async orderCheckStatusOrderDelivery(orderData: any) {
			const token = await this.token();

			const { data } = await this._axios.post(
					`/deliveries/by_id`,
					orderData,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
			);



			return data.orders[0];
	}

	public async orderCheckStatusOrder(orderData: any) {
		const token = await this.token();

			const { data } = await this._axios.post(
					`/order/by_id`,
					orderData,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
			);

			return data.orders[0];
	}

    public async checkOrder(orderData: any) {
        const token = await this.token();

        const { data } = await this._axios.post<OrderCheckCreationResult>(
            `/api/0/orders/checkCreate?access_token=${token}`,
            orderData
        );

        return data;
    }

    public async stopList(organization: UniqueId) {
        const token = await this.token();
        const { data } = await this._axios.post(
					`/stop_lists`,
					{
						"organizationIds": [
							organization
						]
					},
					{
						headers: { Authorization: `Bearer ${token}` }
					}
			);

				if(data.terminalGroupStopLists.length === 0){
					return []
				}

        return data.terminalGroupStopLists.map((val:any) =>{
					return val.organizationId === organization &&  val.items
				})[0];
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
	public async getDeliveryZones(body:{organizationIds:string[]}):Promise<iiko.IZone>{
		const token = await this.token();

		const { data } = await this._axios.post(
			`/delivery_restrictions`,
					body,
					{
						headers: { Authorization: `Bearer ${token}` }
					}
			);

			
			
			return data.deliveryRestrictions[0].deliveryZones[0]
	}

	public async getStreetCity(organizationIds:string,cityId:string):Promise<any>{
		const token = await this.token();

		const { data } = await this._axios.post(
			`/streets/by_city`,
					{
						"organizationId": organizationIds,
						"cityId": cityId
					},
					{
						headers: { Authorization: `Bearer ${token}` }
					}
			);

			
			
			return data.streets
	}

	public async getOrganization(id = ""):Promise<any>{
		const token = await this.token();

		const { data } = await this._axios.post(
			`/organizations`,
					{
						"organizationIds": [
							id
						],
						"returnAdditionalInfo": true,
						"includeDisabled": true
					},
					{
						headers: { Authorization: `Bearer ${token}` }
					}
			);

			
			
			return id ? data.organizations[0] : data.organizations
	}

}

export const iikoAxiosProviders = [
    {
        provide: "IIKO_AXIOS",
        useFactory: () => new IIkoAxios()
    }
];
