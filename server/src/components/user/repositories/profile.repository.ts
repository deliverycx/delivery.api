import { Injectable, Inject } from "@nestjs/common";
import { Model } from "mongoose";
import { ProfileClass } from "src/database/models/profile.model";

@Injectable()
export class ProfileRepository {
	constructor(
		@Inject("Profile")
		private readonly Model: Model<ProfileClass>
	) { }

	async creatProfile(userid:string){
		const user = await this.Model.create({
			userid
		})
	}

	async findProfile(userid:string){
		const result = await this.Model.findOne({userid})
		return result
	}

	async undatePersonal(userId: UniqueId, personalbody: any) {
		const result = await this.Model.findOneAndUpdate({userid:userId}, {
			personal: personalbody,
		}, { upsert: true, new: true });
	}
}