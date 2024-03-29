import { Injectable } from "@nestjs/common";
import { ProfileRepository } from "../repositories/profile.repository";

@Injectable()
export class ProfileUseCase {
	constructor(
		private readonly profileRepository: ProfileRepository
	){}

	getProfile(userid:string){
		return this.profileRepository.findProfile(userid)
	}
	personal(userid: string, body: any) {

		return this.profileRepository.undatePersonal(userid, body)
	}

	adress(userid: string, body: any) {

		return this.profileRepository.undateAdressDelivery(userid, body)
	}
	adressDelite(userid: string, body: any) {

		return this.profileRepository.deliteAdressDelivery(userid, body)
	}
}