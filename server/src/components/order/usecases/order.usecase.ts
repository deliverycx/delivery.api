import { Inject, Injectable } from "@nestjs/common";
import { OrderDTO } from "../dto/order.dto";
import { IOrderUtilsService } from "../services/order/interface.service";
import { OrderCheckBuilder } from "./builders/orderCheck.builder";
import { OrderCreateBuilder } from "./builders/orderCreate.builder";
import { OrderCheckDto } from "../dto/orderCheck.dto";
import { REDIS } from "src/modules/redis/redis.constants";
import { RedisClient } from "redis";


@Injectable()
export class OrderUsecase {
    constructor(
        private readonly OrderUtilsService: IOrderUtilsService,
				@Inject(REDIS) private readonly redis: RedisClient,
        private readonly orderCreateBuilder: OrderCreateBuilder,
        private readonly orderCheckBuilder: OrderCheckBuilder,

    ) {}

    async create(userId: UniqueId, orderInfo: OrderDTO) {
        await this.orderCreateBuilder.initialize(userId, orderInfo);

        await this.orderCreateBuilder.createOrder();

        await this.orderCreateBuilder.duplicateOrder();


        return this.orderCreateBuilder.getOrderEntity();
    }

    async checkOrder(userId: UniqueId, orderInfo: OrderCheckDto) {
        await this.orderCheckBuilder.initialize(userId, orderInfo);

        //await this.orderCheckBuilder.checkCardPaymentAviables();

        await this.orderCheckBuilder.validateCart();

        await this.orderCheckBuilder.validateCount();

				await this.orderCheckBuilder.terminalIsAlive()

        //await this.orderCheckBuilder.serviceValidate();

				//await this.orderCheckBuilder.checkStopList()

        return this.orderCheckBuilder.getResult();
    }

    async getOrderNumber(hash: string) {
        const orderNumber = await this.OrderUtilsService.getOrderNumber(hash);

        return orderNumber;
    }

		

		async getStatusOrder(){
			return await this.orderCreateBuilder.getOrderStatus()
		}
}
