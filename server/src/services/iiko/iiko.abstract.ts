import { iiko } from "src/services/iiko/interfaces";
import { IWebHookEvent } from "@a2seven/yoo-checkout";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { OrderDTO } from "src/components/order/dto/order.dto";
import { FilterNoZeroBalanceType } from "src/components/stopList/entities/stopList.entity";
import { IDeliveryPrices } from "../delivery/delivery.abstract";

export enum OrderTypesEnum {
    PICKUP = "PICKUP",
    COURIER = "COURIER",
		ONSPOT = "ONSPOT"
}

export const constOrderPaymentTypes = {
	CASH:"CASH",
	CARD:"CARD",
	BYCARD:"BYCARD",
	PAY:"PAY",
	KUR:"KUR"
}

export interface IReturnIikoOrderTypes {
    name: string;
    id: UniqueId;
}
export interface IReturnCreateOrder {
    result: string;
    problem: any;
}

export abstract class IIiko {
    abstract create: (
        cart: Array<CartEntity>,
        customerInfo: OrderDTO,
        prices: IDeliveryPrices
    ) => Promise<any>;

		abstract statusOrder: (
			organizationId:string,orderIds:string,orderTypes:string
	) => Promise<any>;

    abstract getOrderTypesId: (
        organizationId: UniqueId,
        orderType: OrderTypesEnum
    ) => Promise<IReturnIikoOrderTypes>;

    abstract check: (
        userId: UniqueId,
        cart: Array<CartEntity>,
        orderInfo: OrderDTO
    ) => Promise<iiko.ICheckResult>;

    abstract getStopList: (
			organizationId:string
    ) => Promise<any>;

		abstract getDiscount: (
			organizationId: UniqueId,
			cart: Array<CartEntity>,
		) => any;

		abstract getTerminalLive: (
			organizationId: UniqueId,
		) => any
		

		abstract getStreetCityIkko: (
			body:{
				organizationId:string
				cityId:string
			}
		) => any;

		abstract updatePayment: (
			body:any
		) => any;

		abstract updateOrderProblem: (
			body:any,
			problems:any
		) => any;
		
}
