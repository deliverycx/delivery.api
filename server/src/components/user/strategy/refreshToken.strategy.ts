import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserUsecase } from "../usecases/user.usecase";
import * as argon2 from 'argon2';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy,'refresh') {
    constructor(private userService:UserUsecase){
        super({
            ignoreExpiration: true,
            passReqToCallback:true,
            secretOrKey:process.env.SESSION_SECRET,
            jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
                let data = request?.cookies["auth-cookie"];
                if(!data){
                    return null;
                }
                return data.token
            }])
        })
    }

    async validate(req:Request, payload:any){
        if(!payload){
            throw new BadRequestException('invalid jwt token');
        }
        let data = req?.cookies["auth-cookie"];
        if(!data?.refreshToken){
            throw new BadRequestException('invalid refresh token');
        }
        const user = await this.userService.getUser(req.body.id)
				if(!user){
            throw new BadRequestException('token expired');
        }
				const tokenMatches = await argon2.verify(user.getToken,data?.refreshToken)
				if(!tokenMatches){
					throw new BadRequestException('Matches invalid refresh token');
				}
				
        return user;
    }
}