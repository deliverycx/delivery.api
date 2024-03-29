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

    ) {
        super();
    }

    public sendDuplicate(
        address: string,
        customer: ICustomer,
        comment: string,
        organization: UniqueId,
        cart: Array<CartEntity>,
        orderType: string,
				orderTypeName:string,
				ONSPOTTable:number
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
            orderType,
						orderTypeName,
						ONSPOTTable
        });
    }
		public PaymentOrder(organizationId,data:any){
			this.botRequest.PaymentOrder(organizationId,data)
		}

		public ReturnPaymentOrder(organizationId,data:any){
			this.botRequest.ReturntPayment(organizationId,data)
		}

		public canselPaymentOrder(organizationId,data:any){
			this.botRequest.calseledPayment(organizationId,data)
		}

    public sendReserveTable(data:BotReverveTableDTO) {
			this.botRequest.reserveTable(data.organizationId,data)
    }
}
