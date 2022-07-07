import { Inject, Injectable } from "@nestjs/common";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { IIiko, OrderTypesEnum } from "../iiko/iiko.abstract";
import { IIkoAxios } from "../iiko/iiko.axios";
import { IDeliveryPrices, IDeliveryService } from "./delivery.abstract";

@Injectable()
export class DeliveryService implements IDeliveryService {
	protected iiko:IIkoAxios
    constructor(
			private readonly cartRepository: ICartRepository,
			) {
				this.iiko = new IIkoAxios()
			}

    private async deliveryPriceCalculating(
        price: number,
        orderType: OrderTypesEnum
    ): Promise<number> {
        if (orderType === OrderTypesEnum.PICKUP) {
            return 0;
        }

        return price < 600 ? 150 : 0;
    }
    private async cartPriceCalculating(userId: UniqueId,organization?:string): Promise<number> {
        let totalPrice = await this.cartRepository.calc(userId);
				/*
				const carts = await this.cartRepository.getAllDisc(userId)
				if(organization){
					const data = await this.iiko.discontList(
						{
							organization,
							order:{
								items:carts
							}
						})
						console.log(carts);
						console.log(data);
				}
				*/
				

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
            deltaPrice = 600 - totalPrice < 0 ? 0 : 600 - totalPrice;
        }

        return {
            deliveryPrice,
            totalPrice: totalPrice + deliveryPrice,
            deltaPrice
        };
    }
		
}
