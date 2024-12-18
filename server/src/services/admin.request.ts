import { Inject, Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { RedisClient } from "redis";
import { Axios } from "src/common/abstracts/request";
import { REDIS } from "src/modules/redis/redis.constants";

@Injectable()
export class AdminAxiosRequest {
	public _axios: AxiosInstance;
	private hosturl

	constructor(
		@Inject(REDIS) private readonly redis: RedisClient
	) {



	}

	public async getLocalhost() {
		const adminurl = process.env.NODE_ENV === 'development' ? `${process.env.ADMIN_URL}`
			: `${process.env.ADMIN_URL}`
		return adminurl
	}

	public async getOrganizationList(organization: string) {
		const url = await this.getLocalhost()
		//console.log('url',url); 
		/**/
		const { data } = await axios.get(`${url}/unload/getNomenclature?organization=${organization}`);

		return data


	}

	public async getStreets(organization: string) {
		const url = await this.getLocalhost()
		//console.log(url); 
		/**/
		const { data } = await axios.get(`${url}/unload/getStreet?organization=${organization}`);

		return data
	}

	public async getUrlCounter(organization: string) {
		const url = await this.getLocalhost()
		//console.log(url); 
		/**/
		const { data } = await axios.get(`${url}/counterhinkal/buorg?organization=${organization}`);

		return data
	}
}