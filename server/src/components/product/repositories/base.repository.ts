import {
    ProductClass,
    ProductModel
} from "../../../database/models/product.model";
import { IProductRepository } from "./interface.repository";
import { ProductEntity } from "../entities/product.entity";
import { CategoryClass } from "../../../database/models/category.model";
import { productMapper } from "../entities/product.mapper";
import { Inject, Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { FavoriteClass } from "src/database/models/favorite.model";
import { createPipeline } from "./aggregate.pipeline";

@Injectable()
export class ProductRepository implements IProductRepository {
    constructor(
        @Inject("Product")
        private readonly productModel: Model<ProductClass>,

        @Inject("Favorite")
        private readonly favoriteModel: Model<FavoriteClass>
    ) {}

    async getFavorites(userId: UniqueId) {
        const result:any = await this.favoriteModel.findOne({
					user:userId
				})
				
				return result ? result.products : null
				/*
        return result ? result.products.map((product: any) => ({
					...product,
					isFav: true
			})) : null
			*/
    }

    async getAll(categoryId: UniqueId, userId: UniqueId): Promise<any> {
        const pipeline = createPipeline(
            {
                $match: {
                    category: new Types.ObjectId(categoryId),
                    tags: { $nin: ["hidden"] }
                }
            },
            userId
        );

        const result = await this.productModel.aggregate(pipeline);

        const productsPopulate = await Promise.all(
            result.map(async (product) => {
                return await new this.productModel(product).populate(
                    "category"
                );
            })
        );

        return productMapper(productsPopulate);
    }

    async getOne(productId: UniqueId, userId: UniqueId) {
        const pipeline = createPipeline(
            {
                $match: {
                    _id: new Types.ObjectId(productId),
                    tags: { $nin: ["hidden"] }
                }
            },
            userId
        );

        const result = await this.productModel.aggregate(pipeline);

        const productPopulate = (
            await Promise.all(
                result.map(async (product) => {
                    return await new this.productModel(product).populate(
                        "category"
                    );
                })
            )
        )[0];

        return new ProductEntity(
            productPopulate?._id,
            productPopulate?.name,
						productPopulate?.id,
            productPopulate?.description,
            productPopulate?.additionalInfo,
            productPopulate?.price,
            productPopulate?.weight,
            productPopulate?.measureUnit,
            productPopulate?.image,
            (productPopulate?.category as CategoryClass)?.image,
            productPopulate?.isFav
        );
    }

    async getBySearch(
        searchString: string,
        organizationId: UniqueId,
        userId: UniqueId
    ) {
        const pipeline = createPipeline(
            {
                $match: {
                    organization: new Types.ObjectId(organizationId),
                    name: { $regex: searchString, $options: "i" },
                    tags: { $nin: ["hidden"] }
                }
            },
            userId
        );
        const result = await this.productModel.aggregate(pipeline);

        const productsPopulate = await Promise.all(
            result.map(async (product) => {
                return await new this.productModel(product).populate(
                    "category"
                );
            })
        );

        return productMapper(productsPopulate);
    }
}
