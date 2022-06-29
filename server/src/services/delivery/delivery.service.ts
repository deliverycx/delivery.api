import { Injectable } from "@nestjs/common";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { OrderTypesEnum } from "../iiko/iiko.abstract";
import { IDeliveryPrices, IDeliveryService } from "./delivery.abstract";

@Injectable()
export class DeliveryService implements IDeliveryService {
    constructor(private readonly cartRepository: ICartRepository) {}

    private async deliveryPriceCalculating(
        price: number,
        orderType: OrderTypesEnum
    ): Promise<number> {
        if (orderType === OrderTypesEnum.PICKUP) {
            return 0;
        }

        return price < 700 ? 150 : 0;
    }
    private async cartPriceCalculating(userId: UniqueId,organization?:string): Promise<number> {
        let totalPrice = await this.cartRepository.calc(userId);
				const carts = await this.cartRepository.getAll(userId)
				console.log(carts);
				if(organization){

				}

        return totalPrice;
    }

    public async calculatingPrices(
        userId: UniqueId,
        orderType: OrderTypesEnum,
				organization?:string
    ): Promise<IDeliveryPrices> {
        const totalPrice = await this.cartPriceCalculating(userId,organization);
        const deliveryPrice = await this.deliveryPriceCalculating(
            totalPrice,
            orderType
        );
        let deltaPrice = 0;

        if (orderType === OrderTypesEnum.COURIER) {
            deltaPrice = 700 - totalPrice < 0 ? 0 : 700 - totalPrice;
        }

        return {
            deliveryPrice,
            totalPrice: totalPrice + deliveryPrice,
            deltaPrice
        };
    }
}
