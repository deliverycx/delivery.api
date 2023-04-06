import { CartEntity } from "src/components/cart/entities/cart.entity";
import { OrderDTO } from "../../dto/order.dto";
import { OrderEntity } from "../../entities/order.entity";

export abstract class IOrderUtilsService {
    abstract getOrderNumber(hash: string): Promise<OrderEntity>;
}

export type IorderCreateBody = {
	orderbody:OrderDTO,
	cart:CartEntity[]
}