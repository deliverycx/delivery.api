import { Inject, Injectable } from "@nestjs/common";
import { UserClass } from "src/database/models/user.model";
import { Model } from "mongoose";
import { IGuestGenerateService } from "./guestUsername.stub";
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class GenerateUsernameService implements IGuestGenerateService {
    constructor(
        @Inject("User")
        private readonly UserModel: Model<UserClass>
    ) {}

    async generate(): Promise<string> {
				const salt = await genSalt(10)
        const username = "u_" + Math.random().toString(36).substr(2, 9);

        const isFind = await this.UserModel.findOne({ username });

        if (isFind) {
            return this.generate();
        }
				//const usernamehash = await hash(username, salt)
        return username;
    }

		
}
