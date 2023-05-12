import { Injectable } from "@nestjs/common";
import { OrderCreateEntity } from "../entities/order.entity";

@Injectable()
export abstract class IOrderRepository {
    abstract create(
        userId: UniqueId,
        cartPrice: number,
        orderNumber: string
    ): Promise<void>;

		abstract	createOrder(entiti:OrderCreateEntity): Promise<void>
		abstract	getOrderBYhash(hash:string): Promise<any>
}
