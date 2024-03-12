import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ProfileUseCase } from "../usecases/profile.useCase";
import { JwtAuthGuard } from "src/guards/jwt.guard";
import axios from "axios";

@UseGuards(JwtAuthGuard)
@Controller("profile")
export class ProfileController {
	constructor(
		private readonly profileUseCase: ProfileUseCase
	){}

	@Get('getprofile')
	async getuserPersonal(@Query() query: {userid:string}){
		const result = await this.profileUseCase.getProfile(query.userid)
		return result
	}

	@Post('personal')
	userPersonal(@Body() body: any){
		return this.profileUseCase.personal(body.userid,body)
	}

	@Post('adressdelivery')
	userAdressDelivery(@Body() body: any){
		return this.profileUseCase.adress(body.userid,body)
	}
	@Post('deladressdelivery')
	delAdressDelivery(@Body() body: any){
		return this.profileUseCase.adressDelite(body.userid,body)
	}

	@Get("bumerang")
	async bumerang(@Query() query: {phone:string}){
		console.log(query);
		const {data} = await axios.get(`https://api.digitalwallet.cards/api/v2/cards?customerPhone=${query.phone}`, {
			headers: {
					'X-API-Key': 'c48979a6ec072f13b67dbf825a9fe191',
			}
		})
		if(data && Array.isArray(data.data)){
			return data.data
		}

		return false
	}
	
}