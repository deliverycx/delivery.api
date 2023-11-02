import { Inject, Injectable } from "@nestjs/common";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { OrderDTO } from "../../dto/order.dto";
import { IOrderRepository } from "../../repositores/interface.repository";
import { OrderCreateEntity } from "../../entities/order.entity";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { IorderCreateBody } from "./interface.service";
import { ClientProxy } from "@nestjs/microservices";
import { RedisClient } from "redis";
import { REDIS } from "src/modules/redis/redis.constants";
import { OrderRepository } from "../../repositores/base.repository";

@Injectable()
export class OrderService{
	constructor(
		private readonly orderRepository: IOrderRepository,
		private readonly CartRepository: ICartRepository,
		@Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
		@Inject(REDIS) private readonly redis: RedisClient,
	){
		this.communicationClient.connect();
	}

	async createOrderToRabbit(user:string,body:OrderDTO,paymentbody?:any){
		const orderbody = await this.orderBody(user, body)
		await this.createOrderModel(orderbody,user,paymentbody)
		await this.orderSubmitRabbit(orderbody)
	}

	async orderBody(user:string,body:OrderDTO){
		const cart = await this.CartRepository.getAll(user);
		console.log('cart',cart);
		return {
			orderbody:body,
			cart:cart
		}
	}

	async createOrderModel({orderbody,cart}:IorderCreateBody,user:string,paymentbody?:any){
		/**/
		const entity:OrderCreateEntity = {
			user:user,
			organization:orderbody.organization,
			orderHash:orderbody.hash,
			orderItems:cart,
			orderParams:orderbody,
			orderStatus:"CREATED",
			orderNumber:null,
			payment:paymentbody
		}

		await this.orderRepository.createOrder(entity)
		
	}

	async orderSubmitRabbit(body:IorderCreateBody){
		console.log('rabiit',body);
		const q = this.communicationClient.emit(
      'order_created',
      body,
    )
	}

	getOrderHash(hash:string){
		return this.orderRepository.getOrderBYhash(hash)
	}

	getOrderUser(user:string){
		return this.orderRepository.metodOrderBYUser(user)
	}

	getOrderRedisHash(hash:string){
		return new Promise((resolve, reject) => {
			this.redis.get(hash, (err, number) => {
					resolve(number);  
			});
	});
	}
}