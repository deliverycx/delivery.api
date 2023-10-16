import { Injectable } from "@nestjs/common";
import { IFavoriteRepository } from "src/components/favorites/repositories/interface.repository";
import { UserEntity } from "../entities/user.entity";
import { IUserRepository } from "../repositories/interface.repository";
import { IGuestGenerateService } from "../services/guestUsername.stub";
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SendCodeService } from "../services/sendCode.service";
import { SMSAeroServices } from "src/services/smsaero/smsaero.service";
import { InternalException } from "src/filters/internal.filter";
import { UpdateDTO } from "../dto/update.dto";
import { ProfileRepository } from "../repositories/profile.repository";


@Injectable()
export class UserUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly favoriteRepository: IFavoriteRepository,
        private readonly generateUsernameService: IGuestGenerateService,
				private readonly jwtService: JwtService,
				private readonly sendCodeService:SendCodeService,
				private readonly sMSAeroServices:SMSAeroServices,
				private readonly profileRepository:ProfileRepository
    ) {}

    async create(
        username: string,
        name?: string,
        phone?: string,
        address?: string
    ) {
        return await this.userRepository.create(username, name, phone);
    }

    async createGuest() {
        const username = await this.generateUsernameService.generate();
        return await this.create(username);
    }

    async getUser(userId: UniqueId) {
        return await this.userRepository.getUser(userId);
    }

    async updateAuthUser(updateProps: UpdateDTO) {
			const phone = await this.sendCodeService.checkCode(updateProps.code)
			if(phone){
				const user = await this.userRepository.findUser({phone:updateProps.phone})
				if(user){
					return user
				}
				if(updateProps.phone){
					const user = await this.userRepository.updateUser(updateProps.id, updateProps);
					await this.profileRepository.creatProfile(updateProps.id)
					return user
				}
			}
			return false
			
        
    }



		async updateRefreshToken(userName: string,refreshToken:string){
			const hashtoken = await argon2.hash(refreshToken)
			await this.userRepository.updateUserRefresh(userName,hashtoken)
			
		}

		async getJwtToken(username: string) {
			const [accessToken, refreshToken] = await Promise.all([
				this.jwtService.signAsync(
					{
						username,
					},
					{
						secret: process.env.SESSION_SECRET,
						expiresIn: '3d',
					},
				),
				this.jwtService.signAsync(
					{
						username,
					},
					{
						secret: process.env.REFRESH_SECRET,
						expiresIn: '7d',
					},
				),
			]);

			return {
				accessToken,
				refreshToken,
			};
		}

		async sendSMSAreo(phone:string){
			if(phone && typeof phone === 'string'){
				const code = await this.sendCodeService.sendSMSCode(phone)
				if(code && typeof code === 'string'){
					await this.sMSAeroServices.smsAutrorization(phone,code)
				}
			}else{
				throw new InternalException();
			}
			
		}

		
}
