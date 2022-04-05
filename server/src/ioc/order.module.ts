import { Module } from "@nestjs/common";
import { cartProviders } from "src/components/cart/providers/cart.provider";
import { CartRepository } from "src/components/cart/repositories/base.repository";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { OrderController } from "src/components/order/controllers/order.controller";
import { orderProviders } from "src/components/order/providers/order.provider";
import { OrderRepository } from "src/components/order/repositores/base.repository";
import { IOrderRepository } from "src/components/order/repositores/interface.repository";
import { PaymentService } from "src/services/payment/payment.service";
import { ValidationCount } from "src/components/order/services/validationCount/validationCount.service";
import { OrderUsecase } from "src/components/order/usecases/order.usecase";
import { IikoService } from "src/services/iiko/iiko.service";
import { DeliveryService } from "src/services/delivery/delivery.service";
import { IDeliveryService } from "src/services/delivery/delivery.abstract";
import { productProviders } from "src/components/product/providers/product.provider";
import { IikoModule } from "src/modules/iiko.module";
import { paymasterProvider } from "src/services/payment/sdk/provider/paymaster.provider";
import { RedisModule } from "src/modules/redis/redis.module";
import { IOrderUtilsService } from "src/components/order/services/order/interface.service";
import { OrderUtilsService } from "src/components/order/services/order/base.service";
import { BotAxiosProvider } from "src/services/duplicateBot/bot.axios";
import { OrderCreateBuilder } from "src/components/order/usecases/builders/orderCreate.builder";
import { OrderCheckBuilder } from "src/components/order/usecases/builders/orderCheck.builder";
import { BotService } from "src/services/duplicateBot/bot.service";
import { IBotService } from "src/services/duplicateBot/bot.abstract";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [IikoModule, RedisModule],
    controllers: [OrderController],
    providers: [
        PaymentService,
        {
            provide: IDeliveryService,
            useClass: DeliveryService
        },
        OrderUsecase,
        {
            provide: IOrderRepository,
            useClass: OrderRepository
        },
        {
            provide: "IIiko",
            useClass: IikoService
        },
        {
            provide: IOrderUtilsService,
            useClass: OrderUtilsService
        },
        {
            provide: ICartRepository,
            useClass: CartRepository
        },
        {
            provide: ValidationCount,
            useClass: ValidationCount
        },
        {
            provide: OrderCreateBuilder,
            useClass: OrderCreateBuilder
        },
        {
            provide: OrderCheckBuilder,
            useClass: OrderCheckBuilder
        },
        {
            provide: IBotService,
            useClass: BotService
        },
        paymasterProvider,
        BotAxiosProvider,
        ...productProviders,
        ...cartProviders,
        ...orderProviders
    ]
})
export class OrderModule {}
