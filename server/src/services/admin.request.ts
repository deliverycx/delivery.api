import { Injectable } from "@nestjs/common";
import { AxiosInstance } from "axios";
import { Axios } from "src/common/abstracts/request";

@Injectable()
export class AdminAxiosRequest extends Axios {
	public _axios: AxiosInstance;

	constructor(
		
	) {
		super(
			process.env.ADMIN_URL
		);
	}

	public async getOrganizationList(organization:string) {
		
		const { data } = await this._axios.get(`/unload/getNomenclature?organization=${organization}`);
		console.log(data);
		return data
	}
}