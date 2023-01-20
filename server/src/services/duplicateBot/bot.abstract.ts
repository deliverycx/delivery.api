import { CartEntity } from "src/components/cart/entities/cart.entity";
import { BotReverveTableDTO } from "./bot.DTO";

export interface ICustomer {
    name: string;
    phone: string;
}

export abstract class IBotService {
    abstract sendDuplicate(
        address: string,
        customer: ICustomer,
        comment: string,
        organization: UniqueId,
        cart: Array<CartEntity>,
        orderTypeName: string,
				orderType:string,
				ONSPOTTable:number
  ): void;
  abstract PaymentOrder(organizationId,data:any)
	abstract ReturnPaymentOrder(organizationId,data:any)
  abstract sendReserveTable(data:BotReverveTableDTO)
}
