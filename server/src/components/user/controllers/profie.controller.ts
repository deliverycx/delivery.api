import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ProfileUseCase } from "../usecases/profile.useCase";

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
}