import { Injectable } from "@nestjs/common"
import { SmsAeroAxios } from "./smsaero.request"

@Injectable()
export class SMSAeroServices{
	smsAeroAxios:SmsAeroAxios

	constructor(){
		this.smsAeroAxios = new SmsAeroAxios()
	}

	async smsAutrorization(phone:string,code:string){
		await this.smsAeroAxios.smsautorization({})
	}
}