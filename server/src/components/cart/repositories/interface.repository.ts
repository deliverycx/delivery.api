import { CartEntity } from "../entities/cart.entity";

export abstract class ICartRepository {
    abstract getAll(userId: UniqueId): Promise<Array<CartEntity>>;

    abstract removeAll(userId: UniqueId): Promise<[]>;

    abstract add(userId: UniqueId, productId: UniqueId): Promise<CartEntity>;

    abstract removeOne(userId: UniqueId, cartId: UniqueId): Promise<UniqueId>;

    abstract changeAmount(
        userId: UniqueId,
        cartId: UniqueId,
        value: number
    ): Promise<CartEntity>;

    abstract calc(userId: UniqueId): Promise<number>;

    abstract removeSome(removeItems: Array<UniqueId>);
}
