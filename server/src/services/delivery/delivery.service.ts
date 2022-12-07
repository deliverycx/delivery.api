import { Inject, Injectable } from "@nestjs/common";
import { validationHIdiscount } from "src/common/helpers/validationHIdiscount";
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
        if (orderType === OrderTypesEnum.PICKUP || orderType === OrderTypesEnum.ONSPOT) {
            return 0;
        }

        return price < 700 ? 150 : 0;
    }
    private async cartPriceCalculating(userId: UniqueId,discount?:number): Promise<number> {
        let totalPrice = await this.cartRepository.calc(userId);
				console.log(totalPrice,discount,totalPrice - discount);
        return discount ? totalPrice - discount : totalPrice
    }

    public async calculatingPrices(
        userId: UniqueId,
        orderType: OrderTypesEnum,
				organization?:string,
				discount?:number
    ): Promise<IDeliveryPrices> {
				const carts = await this.cartRepository.getAllDisc(userId)
				const {count,min} = validationHIdiscount(carts)

        const totalPrice = await this.cartPriceCalculating(userId,min);
        const deliveryPrice = await this.deliveryPriceCalculating(
            totalPrice,
            orderType
        );

				console.log(totalPrice);

				
				
				
				
        let deltaPrice = 0;

        if (orderType === OrderTypesEnum.COURIER) {
            deltaPrice = 700 - totalPrice < 0 ? 0 : 700 - totalPrice;
        }

				if(count !== 0){
					return {
            deliveryPrice,
            totalPrice: totalPrice + deliveryPrice,
            deltaPrice:deltaPrice !== 0 ? deltaPrice : 0
        	};
				}

        return {
            deliveryPrice,
            totalPrice: totalPrice + deliveryPrice,
            deltaPrice
        };
    }

		async discountDozenServise(userId: UniqueId,organization:string){
				const carts = await this.cartRepository.getAllDisc(userId)
				const cartValid = validationHIdiscount(carts)
				console.log(cartValid);
				/*
				if(organization){
					const data = await this.iiko.discontList(
						{
							organization,
							order:{
								items:carts
							}
						})
						
						const dozen = data.loyatyResult.programResults.filter((val:any)=> val.name.indexOf('12-е хинкали в подарок') >= 0 && val)[0];
						
						if(dozen.discounts.length){
							const {discountSum} = dozen.discounts[0]
							return{
								discountDozen:discountSum
							}
						}
						
				}
				*/
				
				return {
					discountDozen:0
				}
		}
		async deliveryZone(organization:string){
			const {coordinates} = await this.iiko.getDeliveryZones({
				organizationIds:[organization]
			})
			const mass = coordinates.reduce((acc:number[][],val,index)=>{
				acc.push([Number(val.latitude),Number(val.longitude)])
				
				return acc
			},[])

			return mass
		}
		
		
}
