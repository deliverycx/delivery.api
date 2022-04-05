import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../entities/product.entity";

// export interface IProductRepository {
//     getOne: (productId: UniqueId) => Promise<ProductEntity>;
//     getAll: (categoryId: UniqueId) => Promise<Array<ProductEntity>>;
//     getBySearch: (
//         searchString: string,
//         organizationId: UniqueId
//     ) => Promise<Array<ProductEntity>>;
// }

@Injectable()
export abstract class IProductRepository {
    abstract getOne(
        productId: UniqueId,
        userId: UniqueId
    ): Promise<ProductEntity>;

    abstract getFavorites(userId: UniqueId): Promise<Array<ProductEntity>>;

    abstract getAll: (
        categoryId: UniqueId,
        userId: UniqueId
    ) => Promise<Array<ProductEntity>>;

    abstract getBySearch: (
        searchString: string,
        organizationId: UniqueId,
        userId: UniqueId
    ) => Promise<Array<ProductEntity>>;
}
