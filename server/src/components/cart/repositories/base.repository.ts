import { BaseRepository } from "../../../common/abstracts/base.repository";
import { CartClass } from "../../../database/models/cart.model";
import { ProductClass } from "../../../database/models/product.model";
import { CartEntity } from "../entities/cart.entity";
import { cartMapper,cartMapperCust } from "../entities/cart.mapper";
import { ICartRepository } from "./interface.repository";
import { Model, Types } from "mongoose";
import { Inject } from "@nestjs/common";
import { OrganizationTablesClass, } from "src/database/models/organizationTables.model";
import { identity } from "rxjs";

export class CartRepository
    extends BaseRepository<Array<CartClass>, Array<CartEntity>>
    implements ICartRepository
{
    constructor(
        @Inject("Cart")
        private readonly CartModel: Model<CartClass>,
				@Inject("Organizationtables")
        private readonly OrganizationTablesModel: Model<OrganizationTablesClass>
    ) {
        super(CartModel, cartMapper, "user");
    }

    async add(userId: UniqueId, producte: any,amounte = 1) {
        const result = await this.CartModel.findOneAndUpdate(
            {
                user: userId,
                product: producte
            },
            {
                $setOnInsert: {
                    product: producte
                },
                $inc: {
                    amount: amounte
                }
            },
            { upsert: true, new: true }
        )//.populate("product");

        const product = result.product as ProductClass;

        return new CartEntity(
            result?._id,
            product?.name,
            product?.image,
            product?.tags,
            product?.productId,
            result?.amount,
            product?.price
        );
    }

    async removeAll(userId: UniqueId) {
        await this.CartModel.deleteMany({
            user: userId
        });

        return [] as [];
    }

    async removeOne(userId: UniqueId, cartId: UniqueId) {
        await this.CartModel.deleteOne({
            user: userId,
            _id: cartId
        });

        return cartId;
    }

    async changeAmount(userId: UniqueId, cartId: UniqueId, value: number) {
        const result = await this.CartModel.findOneAndUpdate(
            {
                user: userId,
                _id: cartId
            },
            {
                $set: {
                    amount: value
                }
            },
            { new: true }
        )//.populate("product");

        const product = result.product as ProductClass;

        return new CartEntity(
            result._id,
            product.name,
            product.image,
            product.tags,
            product.productId,
            result.amount,
            product.price
        );
    }

    async calc(userId: UniqueId) {
        const calcResult = await this.CartModel.aggregate([
            {
                $match: {
                    user: new Types.ObjectId(userId)
                }
            },
           
            {
                $group: {
                    _id: null,
                    totalPrice: {
                        $sum: {
                            $multiply: ["$product.price", "$amount"]
                        }
                    }
                }
            }
        ]);
				

        return calcResult[0] ? calcResult[0].totalPrice : 0;
    }

    async removeSome(removeItems: Array<UniqueId>) {
			try {
				const result = await this.CartModel.deleteMany({
            product: { $in: removeItems }
        });
				return !!result.deletedCount 
			} catch (error) {
				return false
			}
        
    }

	

		async getAllDisc(userid:string){
			const result = await (this.CartModel
				.find({
					user: userid
				})
				.sort({ order: 1 })
				.populate("product"));
			return cartMapperCust(result);
		}

		async getAllOrgTables(id:string){
			const result = await this.OrganizationTablesModel.find({
				organization:id
			})
			return result.length !== 0 ? result : null
		}
}
