import { Inject, Injectable } from "@nestjs/common";
import { RedisClient } from "redis";
import { REDIS } from "src/modules/redis/redis.constants";
import { OrderEntity } from "../../entities/order.entity";
import { IOrderUtilsService } from "./interface.service";

@Injectable()
export class OrderUtilsService extends IOrderUtilsService {
    constructor(@Inject(REDIS) private readonly redis: RedisClient) {
        super();
    }

    async getOrderNumber(hash: string): Promise<OrderEntity> {
        return new Promise((resolve, reject) => {
            this.redis.get(hash, (err, number) => {
                resolve(new OrderEntity(number));
            });
        });
    }
}
