import { Module } from "@nestjs/common";
import { CartController } from "src/components/cart/controllers/cart.controller";
import { cartProviders } from "src/components/cart/providers/cart.provider";
import { CartRepository } from "src/components/cart/repositories/base.repository";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { CartUsecase } from "src/components/cart/usecases/cart.usecase";
import { IikoModule } from "src/modules/iiko.module";
import { RedisModule } from "src/modules/redis/redis.module";
import { IDeliveryService } from "src/services/delivery/delivery.abstract";
import { DeliveryService } from "src/services/delivery/delivery.service";
import { IIkoAxios } from "src/services/iiko/iiko.axios";
import { IikoService } from "src/services/iiko/iiko.service";

@Module({
    controllers: [CartController],
    providers: [
        CartUsecase,
        {
            provide: ICartRepository,
            useClass: CartRepository
        },
        {
            provide: IDeliveryService,
            useClass: DeliveryService
        },
        ...cartProviders
    ]
})
export class CartModule {}
