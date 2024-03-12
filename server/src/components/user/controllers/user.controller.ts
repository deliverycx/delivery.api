import {
	Body,
	Controller,
	Get,
	Patch,
	Post,
	Query,
	Req,
	Res,
	Session,
	UnauthorizedException,
	UseGuards
} from "@nestjs/common";
import { Request, response, Response } from "express";
import { UserUsecase } from "../usecases/user.usecase";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";
import { UpdateDTO } from "../dto/update.dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/guards/jwt.guard";
import { RefreshStrategy } from "../strategy/refreshToken.strategy";
import { RefreshTokenGuard } from "src/guards/refreshToken.guard";
import { AuthJWTGuard } from "src/guards/auth.guard";

@ApiTags("User endpoints")
@Controller("user")
export class UserController {
	constructor(private readonly userUsecase: UserUsecase) { }

	@Post("create")
	@ApiResponse({
		status: 200,
		type: UserEntity
	})

	//@UseGuards(AuthGuard('jwt'))
	async create(
		@Session() session: Record<string, string>,
		@Req() req, @Res({ passthrough: true }) res: Response
	) {

		const user = await this.userUsecase.createGuest();
		const token = await this.userUsecase.getJwtToken(user.getName)
		await this.userUsecase.updateRefreshToken(user.getId, token.refreshToken);
		const secretData = {
			token: token.accessToken,
			refreshToken: token.refreshToken
		};



		res.cookie('auth-cookie', secretData, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: new Date(Date.now() + 40 * 24 * 60 * 90000), //new Date(Date.now() + 20 * 24 * 60 * 5000)
		});
		session.user = user.getId;

		return user;
	}

	@Post("check_guest")
	//@UseGuards(AuthGuard('refresh'))
	@UseGuards(AuthJWTGuard)
	async checkauth(
		@Session() session: Record<string, string>,
		@Req() req, @Res({ passthrough: true }) res: Response

	) {
		session.user = req.body.id;
		return req.body;
	}

	//@UseGuards(JwtAuthGuard)
	@Post('send_sms')
	async sendsms(@Body() body: { phone: string }) {
		const user = await this.userUsecase.checkRegisterUser(body.phone)
		if(!user){
			return await this.userUsecase.sendSMSAreo(body.phone)
		}else{
			return {error:false}
		}
		
	}


	@Post('send_resetsms')
	async sendResetsms(@Body() body: { phone: string }) {
		const user = await this.userUsecase.checkRegisterUser(body.phone)
		if(user){
			return await this.userUsecase.sendSMSAreo(body.phone)
		}else{
			return {error:false}
		}
		
		
	}


	@Post('resetpassword')
	async resetPassword(@Body() body: { phone: string,password:string }) {
		return await this.userUsecase.resetPassord(body)
		
	}


	@Post('login')
	async login(
		@Body() body: UpdateDTO,
		@Res({ passthrough: true }) res: Response,
		@Session() session: Record<string, string>,
	){
		const user = await this.userUsecase.loginUser(body)
		if(user){
			const token = await this.userUsecase.getJwtToken(user.getName)
			await this.userUsecase.updateRefreshToken(user.getId, token.refreshToken);
			const secretData = {
				token: token.accessToken,
				refreshToken: token.refreshToken
			};



			res.cookie('auth-cookie', secretData, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				expires: new Date(Date.now() + 40 * 24 * 60 * 90000), //new Date(Date.now() + 20 * 24 * 60 * 5000)
			});
			session.user = user.getId;
			res.status(201).json(user);
		}else{
			res.status(401).json();
		}
	}


	@UseGuards(JwtAuthGuard)
	@Post('update')
	async update(
		@Body() body: UpdateDTO,
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.userUsecase.updateAuthUser(body)
		if (user) {
			const token = await this.userUsecase.getJwtToken(user.getName)
			await this.userUsecase.updateRefreshToken(user.getId, token.refreshToken);
			const secretData = {
				token: token.accessToken,
				refreshToken: token.refreshToken
			};



			res.cookie('auth-cookie', secretData, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				expires: new Date(Date.now() + 40 * 24 * 60 * 90000), //new Date(Date.now() + 20 * 24 * 60 * 5000)
			});
		}

		return user
	}

	
}
