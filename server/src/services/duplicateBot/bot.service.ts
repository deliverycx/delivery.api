import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { OrganizationClass } from "src/database/models/organization.model";
import { IBotService, ICustomer } from "./bot.abstract";
import { BotAxios } from "./bot.axios";
import { BotReverveTableDTO } from "./bot.DTO";

@Injectable()
export class BotService extends IBotService {
    constructor(
        @Inject("BOT_AXIOS")
        private readonly botRequest: BotAxios,

				@Inject("Organization")
        private readonly OrganizationModel: Model<OrganizationClass>,
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
    async sendReserveTable(data:BotReverveTableDTO) {
			try {
				const guID = await this.OrganizationModel.findById(data.organizationId).lean()
      	await this.botRequest.reserveTable(guID.id,data)
			} catch (error) {
				console.log(error);
			}
			
    }
}
