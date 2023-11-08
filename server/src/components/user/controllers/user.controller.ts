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
			expires: new Date(Date.now() + 40 * 24 * 60 * 5000), //new Date(Date.now() + 20 * 24 * 60 * 5000)
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
		const user = await this.userUsecase.getUser(req.body.id)
		if(!user){
			throw new UnauthorizedException();
		}
		session.user = user.getId;
		return user;
	}

	//@UseGuards(JwtAuthGuard)
	@Get('send_sms')
	async sendsms(@Query() query: { phone: string }, @Res() response: Response) {
		await this.userUsecase.sendSMSAreo(query.phone)
		response.status(201).json();
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
				expires: new Date(Date.now() + 40 * 24 * 60 * 60000), //new Date(Date.now() + 20 * 24 * 60 * 5000)
			});
		}

		return user
	}

	
}
