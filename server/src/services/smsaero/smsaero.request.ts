import { Injectable } from "@nestjs/common";
import { Axios } from "src/common/abstracts/request";
import { IikoError } from "../iiko/iiko.error";
import { AxiosInstance } from "axios";


export class SmsAeroAxios extends Axios {
	public _axios: AxiosInstance;

	constructor() {
		super(process.env.SMSAERO_URL);
	}

	async smsauth() {
		const { data } = await this._axios.get('https://cxcrimea@yandex.ru:zx4dUbwFtA319jZ3P90q7L2dyjtzD70M@gate.smsaero.ru/v2/auth')
		return data && data.success
	}

	async smstable(body:{phone:string,textsms:string}){
		const urls = encodeURI(`https://cxcrimea@yandex.ru:zx4dUbwFtA319jZ3P90q7L2dyjtzD70M@gate.smsaero.ru/v2/sms/send?number=${body.phone}&text=${body.textsms}&sign=Khinkalich`)
	}

	async smsautorization(body:any){
		const urls = encodeURI(`https://cxcrimea@yandex.ru:zx4dUbwFtA319jZ3P90q7L2dyjtzD70M@gate.smsaero.ru/v2/sms/send?number=${body.phone}&text=${body.textsms}&sign=Khinkalich`)
	}
}