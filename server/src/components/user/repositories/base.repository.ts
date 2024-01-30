import { UserEntity } from "../entities/user.entity";
import { Model } from "mongoose";
import { UserClass } from "../../../database/models/user.model";
import { IUserRepository } from "./interface.repository";
import { Inject, Injectable } from "@nestjs/common";
import { IUpdateProps } from "../interfaces/update.interface";
import * as argon2 from 'argon2';

@Injectable()
export class UserRepository{
    constructor(
        @Inject("User")
        private readonly userModel: Model<UserClass>
    ) {}

    async create(username: string, name: string, phone: string) {
        const user = await this.userModel.create({
            username,
            name,
            phone
        });

        const result = new UserEntity(
            user._id,
            user.username,
            user.phone
        );

        return result;
    }

    async getUser(userId: UniqueId) {
        const result = await this.userModel.findOne({ _id: userId });
        return result && new UserEntity(result?._id, result?.username, result.refreshToken,result.phone);
    }

		async findUser(query:any) {
			const result = await this.userModel.findOne(query);
	
			return result && new UserEntity(result?._id, result?.username, result.refreshToken,result.phone,result?.password);
	}

		async updateUserRefresh(userId: UniqueId,refreshToken:any){
			const user = await this.userModel.findByIdAndUpdate(userId, {refreshToken});
		}

    async updateUser(userId: UniqueId, updateProps: IUpdateProps) {
				
				const passHash = await argon2.hash(updateProps.password)
        const result = await this.userModel.findByIdAndUpdate(userId, {
						phone: updateProps.phone,
						password:passHash
        },{ upsert: true, new: true });
		
        return new UserEntity(result?._id, result?.username, result.refreshToken,result.phone);
    }

		async undatePersonal(userId: UniqueId,personalbody:any){
			const result = await this.userModel.findByIdAndUpdate(userId, {
				personal: personalbody,
			},{ upsert: true, new: true });
		}
}
