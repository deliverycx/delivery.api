import { OrderEntity } from "../../entities/order.entity";

export abstract class IOrderUtilsService {
    abstract getOrderNumber(hash: string): Promise<OrderEntity>;
}
