import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { CartClass } from "src/database/models/cart.model";
import { OrderClass } from "src/database/models/order.model";
import { IOrderRepository } from "./interface.repository";
import { OrderCreateEntity } from "../entities/order.entity";

@Injectable()
export class OrderRepository {
    constructor(
        @Inject("Order")
        private readonly orderModel: Model<OrderClass>
    ) {}

    async create(userId: UniqueId, cartPrice: number, orderNumber: string) {
        await this.orderModel.findOneAndUpdate(
            { user: userId },
            {
                $setOnInsert: {
                    user: userId
                },
                $push: {
                    orders: {
                        price: cartPrice,
                        orderNum: orderNumber
                    }
                }
            },
            { upsert: true }
        );
    }

		async createOrder(entiti:OrderCreateEntity){
			 await this.orderModel.create(entiti)
		}

		async updateOrder(hash:string,bodyPay:any){
			await this.orderModel.findOneAndUpdate({
				orderHash:hash
			},{
				payment:bodyPay

			})
	 }

		async getOrderBYhash(hash:string){
			return await this.orderModel.findOne({orderHash:hash})
	 }

	 async metodOrderBYUser(userid:string){
		const result = await this.orderModel.find({user:userid})
		return result
 	}
}
