
import {
	BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Request } from 'express';
import { UserUsecase } from 'src/components/user/usecases/user.usecase';

@Injectable()
export class AuthJWTGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private userService:UserUsecase
		) {}
	
		async canActivate(context: ExecutionContext): Promise<boolean> {
			const request = context.switchToHttp().getRequest();
			const token = this.extractTokenFromHeader(request);

			if (!token) {
				return false
			}
				
      try {
				const payload = await this.jwtService.verifyAsync(token.token, {
					secret: process.env.SESSION_SECRET,
				});
				if(payload){
					this.refreshToken(token.refreshtoken,request.body.id)
				}

			} catch {
				throw new UnauthorizedException();
			}
			return true;
    }

		private extractTokenFromHeader(request: Request) {
			let data = request.cookies["auth-cookie"];
			if(!data){
				return null;
			}
			return {
				token:data.token,
				refreshtoken:data.refreshToken
			} 
		}

		private async refreshToken(token:string,id:string){
			const user = await this.userService.getUser(id)
				if(!user){
					console.log('token expired',user,id);
					
            //throw new BadRequestException('token expired');
        }
			const tokenMatches = await argon2.verify(user.getToken,token)
				if(!tokenMatches){
					console.log('Matches invalid refresh token',user.getToken,token);
					
					
					//throw new BadRequestException('Matches invalid refresh token');
				}
		}
}