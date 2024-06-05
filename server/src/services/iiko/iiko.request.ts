import { Injectable, Inject } from "@nestjs/common";
import { AxiosInstance } from "axios";
import { RedisClient } from "redis";
import { REDIS } from "src/modules/redis/redis.constants";
import { Axios } from "src/common/abstracts/request";

@Injectable()
export class IIkoAxiosRequest extends Axios {
	public _axios: AxiosInstance;

	constructor(
		@Inject(REDIS) private readonly redis: RedisClient,
	) {
		super(
			process.env.TRANSFER_URL
		);
	}

	async token() {
		const redisToken = new Promise((resolve, reject) => {
			this.redis.get("token", (err, token) => {
				if (!err) {
					resolve(token)
				} else {
					reject(err)
				}
			});
		})

		const tokeninRedis = await redisToken
		if (tokeninRedis) {

			return tokeninRedis
		} else {
			const { data } = await this._axios.post<{ token: string }>(
				`/access_token`,
				{
					apiLogin: process.env.TRANSFER_PASSWORD
				}
			);
			this.redis.set(
				"token",
				data.token,
				"EX",
				10 * 60
			);

			return data.token

		}
	}

	public async getOrganizationList() {
		const token = await this.token();
		const { data } = await this._axios.get(`/organizations`,

			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);


		return data.organizations
	}

	public async getOrganization(organization: string) {
		const token = await this.token();
		const { data } = await this._axios.post(`/organizations`,
			{
				"organizationIds": [
					organization
				],
				"returnAdditionalInfo": true,
				"includeDisabled": false,
				"returnExternalData": [
					"string"
				]
			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);



		return data.organizations[0]
	}

	public async getFoods(id: { organizationId: string }) {
		const token = await this.token();


		const { data } = await this._axios.post(`/nomenclature`,
			{
				organizationId: id.organizationId
			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return data
	}

	public async termiralAlive(organization: string, terminal: string) {
		const token = await this.token();
		//const terminale = await this.termiralGroops(organization)


		const { data } = await this._axios.post<any>(
			`/terminal_groups/is_alive`,
			{
				"organizationIds": [
					organization
				],
				"terminalGroupIds": [
					terminal
				]
			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);



		if (data.isAliveStatus.length !== 0) {
			return data.isAliveStatus[0].isAlive
		} else {
			throw Error()
		}
	}




	public async organizationTables(termital: string) {
		const token = await this.token();
		const { data } = await this._axios.post<{ restaurantSections: any[] }>(
			`/reserve/available_restaurant_sections`,
			{
				"terminalGroupIds": [
					termital
				]
			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);



		return data.restaurantSections;
	}

	public async termiralGroops(organization: string) {
		const token = await this.token();
		const { data } = await this._axios.post<any>(
			`/terminal_groups`,
			{
				organizationIds: [
					organization
				],
				includeDisabled: false
			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);



		return data.terminalGroups[0].items[0];
	}

	public async termiralGroopsAlive(organization: string, terminal: string) {
		const token = await this.token();
		const { data } = await this._axios.post<any>(
			`/terminal_groups/is_alive`,
			{
				organizationIds: [
					organization
				],
				terminalGroupIds: [
					terminal
				]
			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);



		return data.isAliveStatus[0]
	}


	public async getStreetCity(organizationIds: string, cityId: string): Promise<any> {
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

	public async getNomenclature(organization: string): Promise<any> {
		const token = await this.token();

		const { data } = await this._axios.post(
			`/nomenclature`,
			{
				"organizationId": organization
			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);



		return data
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

		if (data.terminalGroupStopLists.length === 0) {
			return []
		}



		return data.terminalGroupStopLists.map((val: any) => {
			return val.organizationId === organization && val.items
		})[0];
	}


	public async updateIIkkoWebHooks(organizationIds: string, urls: string): Promise<any> {
		const token = await this.token();

		const { data } = await this._axios.post(
			`/webhooks/update_settings`,
			{
				"organizationId": organizationIds,
				"webHooksUri": urls,
				"authToken": "8302094a-a920-4072-b076-a3dd50d35fa7"

			},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);



		return data
	}
}