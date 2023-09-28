import { Injectable, Module, Inject } from "@nestjs/common";
import { IDeliveryService } from "src/services/delivery/delivery.abstract";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";
import { AddCartDTO } from "../dto/add.dto";
import { ChangeAmountDTO } from "../dto/changeAmount.dto";
import { DiscountDTO } from "../dto/discount.dto";
import { GetAllCartDTO } from "../dto/getAll.dto";
import { RemoveOneDTO } from "../dto/removeOne.dto";
import { ICartRepository } from "../repositories/interface.repository";

@Injectable()
export class CartUsecase {
    constructor(
        private readonly CartRepository: ICartRepository,
        private readonly DeliveryService: IDeliveryService
    ) {}

    async getAll(userId: UniqueId, data: GetAllCartDTO) {
			
        const result = await this.CartRepository.getAll(userId);
        const prices = await this.DeliveryService.calculatingPrices(
            userId,
            data.orderType,
						data.organization
        );
        return {
            cart: result,
            ...prices
        };
    }

    async add(userId: UniqueId, data: AddCartDTO) {
        const result = await this.CartRepository.add(userId, data.product,data.anmount);
        const prices = await this.DeliveryService.calculatingPrices(
            userId,
            data.orderType,
						data.organization
        );

        return {
            item: result,
            ...prices
        };
    }

    async removeAll(userId: UniqueId) {
        const result = await this.CartRepository.removeAll(userId);

        return result;
    }

    async removeOne(userId: UniqueId, data: RemoveOneDTO) {
        const result = await this.CartRepository.removeOne(userId, data.cartId);
        const prices = await this.DeliveryService.calculatingPrices(
            userId,
            data.orderType,
						data.organization
        );

        return {
            deletedId: result,
            ...prices
        };
    }

    async changeAmount(userId: UniqueId, data: ChangeAmountDTO) {
        const result = await this.CartRepository.changeAmount(
            userId,
            data.cartId,
            data.amount,
        );

        const prices = await this.DeliveryService.calculatingPrices(
            userId,
            data.orderType,
						data.organization
        );

        return {
            item: result,
            ...prices
        };
    }

		async getDiscount(userId: UniqueId,data: DiscountDTO){
			const result = await this.DeliveryService.discountDozenServise(
				userId,
				data.organization
			);

			const prices = await this.DeliveryService.calculatingPrices(
				userId,
				data.orderType,
				data.organization,
				result.discountDozen
			);
			return {
				...result,
				...prices
			}
		}

		async getDeliveryZones({organizationIds}){
			return this.DeliveryService.deliveryZone(organizationIds)
		}

		async getOrganiztionTable(id:string){
			return this.CartRepository.getAllOrgTables(id)
		}
}
