import { CartEntity } from "src/components/cart/entities/cart.entity";
import { OrderTypesEnum } from "../iiko/iiko.abstract";

export interface IDeliveryPrices {
    deliveryPrice: number;
    deltaPrice: number;
    totalPrice: number;
}

export abstract class IDeliveryService {
    abstract calculatingPrices(
        userId: UniqueId,
        orderType: OrderTypesEnum,
				organization?:string,
				discount?:number
    ): Promise<IDeliveryPrices>;

		abstract discountDozenServise(
			userId: UniqueId,
			organization?:string
		) : Promise<{discountDozen:number}>;

		abstract deliveryZone(
			organization:string
		) : Promise<any>
}
