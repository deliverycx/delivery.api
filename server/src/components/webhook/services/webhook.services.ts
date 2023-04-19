import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class WebHookServices{
	async getData(street:string){
		try {
			const url = "https://cleaner.dadata.ru/api/v1/clean/address";
			const token = "4d575df5b58e315429934796a55711d488a8fdec";
			const secret = "1894ee2d296d0ebc7b52704972a965c5dc54a860";
			const query = "мск сухонска 11/-89";

			const options = {
					method: "POST",
					mode: "cors",
					headers: {
							"Content-Type": "application/json",
							"Authorization": "Token " + token,
							"X-Secret": secret
					},
					body: [query]
			}

			const {data} = await axios.post(
				url,
				{
					body: query
				},
				{
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Token " + token,
						"X-Secret": secret
					},
				}
			)

			
		} catch (error) {
			console.log(error);
		}
	}
}