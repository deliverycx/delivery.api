import { Inject, Injectable } from "@nestjs/common";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { OrderDTO } from "../../dto/order.dto";
import { IOrderRepository } from "../../repositores/interface.repository";
import { OrderCreateEntity } from "../../entities/order.entity";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { IorderCreateBody } from "./interface.service";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class OrderService{
	constructor(
		private readonly orderRepository: IOrderRepository,
		private readonly CartRepository: ICartRepository,
		@Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
	){
		this.communicationClient.connect();
	}


	async orderBody(user:string,body:OrderDTO){
		const cart = await this.CartRepository.getAll(user);
		return {
			orderbody:body,
			cart:cart
		}
	}

	async createOrderModel({orderbody,cart}:IorderCreateBody,user:string){
		/**/
		const entity:OrderCreateEntity = {
			user:user,
			organization:orderbody.organization,
			orderHash:orderbody.hash,
			orderItems:cart,
			orderParams:orderbody,
			orderStatus:"CREATED",
			orderNumber:null
		}

		await this.orderRepository.createOrder(entity)
		
	}

	async orderSubmitRabbit(body:IorderCreateBody){
		console.log('rabiit');
		const q = this.communicationClient.emit(
      'order_created',
      body,
    )
	}

	getOrderHash(hash:string){
		return this.orderRepository.getOrderBYhash(hash)
	}
}