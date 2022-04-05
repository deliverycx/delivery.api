import { Injectable } from "@nestjs/common";
import { IFavoriteRepository } from "../repositories/interface.repository";

@Injectable()
export class FavoriteUsecase {
    constructor(private readonly FavoriteRepository: IFavoriteRepository) {}

    async click(productId: UniqueId, userId: UniqueId) {
        const result = await this.FavoriteRepository.add_remove(
            productId,
            userId
        );

        return result;
    }
}
