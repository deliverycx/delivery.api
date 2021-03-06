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
        orderType: string
  ): void;
  
  abstract sendReserveTable(data:BotReverveTableDTO)
}
