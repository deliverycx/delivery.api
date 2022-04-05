import { FavoriteEntity } from "../entities/favorite.entity";

export abstract class IFavoriteRepository {
    abstract add_remove(
        productId: UniqueId,
        userId: UniqueId
    ): Promise<FavoriteEntity>;
    abstract clear(userId: UniqueId): Promise<void>;
}
