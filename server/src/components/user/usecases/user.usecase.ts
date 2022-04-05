import { Injectable } from "@nestjs/common";
import { IFavoriteRepository } from "src/components/favorites/repositories/interface.repository";
import { UserEntity } from "../entities/user.entity";
import { IUserRepository } from "../repositories/interface.repository";
import { IGuestGenerateService } from "../services/guestUsername.stub";

@Injectable()
export class UserUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly favoriteRepository: IFavoriteRepository,
        private readonly generateUsernameService: IGuestGenerateService
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

    async updateUser(userId: UniqueId, updateProps: any) {
        const user = await this.userRepository.updateUser(userId, updateProps);

        if (user.getOrganization !== updateProps.organizationId) {
            await this.favoriteRepository.clear(userId);
        }
    }
}
