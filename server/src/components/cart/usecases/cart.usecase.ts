import { Injectable, Module, Inject } from "@nestjs/common";
import { IDeliveryService } from "src/services/delivery/delivery.abstract";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";
import { AddCartDTO } from "../dto/add.dto";
import { ChangeAmountDTO } from "../dto/changeAmount.dto";
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
            data.orderType
        );
        return {
            cart: result,
            ...prices
        };
    }

    async add(userId: UniqueId, data: AddCartDTO) {
        const result = await this.CartRepository.add(userId, data.productId);
        const prices = await this.DeliveryService.calculatingPrices(
            userId,
            data.orderType
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
            data.orderType
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
            data.amount
        );

        const prices = await this.DeliveryService.calculatingPrices(
            userId,
            data.orderType
        );

        return {
            item: result,
            ...prices
        };
    }
}
