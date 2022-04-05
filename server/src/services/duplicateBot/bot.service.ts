import { Inject, Injectable } from "@nestjs/common";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { IBotService, ICustomer } from "./bot.abstract";
import { BotAxios } from "./bot.axios";

@Injectable()
export class BotService extends IBotService {
    constructor(
        @Inject("BOT_AXIOS")
        private readonly botRequest: BotAxios
    ) {
        super();
    }

    public sendDuplicate(
        address: string,
        customer: ICustomer,
        comment: string,
        organization: UniqueId,
        cart: Array<CartEntity>,
        orderType: string
    ) {
        this.botRequest.sendDuplicate(organization, {
            address: address,
            name: customer.name,
            comment,
            phone: customer.phone,
            items: cart.map((el) => {
                return {
                    amount: el.getAmount,
                    name: el.getProductName
                };
            }),
            orderType
        });
    }
}
