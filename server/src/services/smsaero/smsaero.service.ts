import { Injectable } from "@nestjs/common"
import { SmsAeroAxios } from "./smsaero.request"
import { InternalException } from "src/filters/internal.filter";

@Injectable()
export class SMSAeroServices{
	smsAeroAxios:SmsAeroAxios

	constructor(){
		this.smsAeroAxios = new SmsAeroAxios()
	}

	async smsAutrorization(phone:string,code:string){
		
		const auth = this.smsAeroAxios.smsauth()
		if(auth){
			const result = await this.smsAeroAxios.smsautorization({
				phone:phone,
				textsms:code
			})
			if(result && !result.success){
				throw new InternalException();
			}
		}
		
	}
}