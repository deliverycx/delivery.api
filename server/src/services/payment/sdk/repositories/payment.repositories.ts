import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { OrderPaymentClass } from "src/database/models/orderPayment.model";

Injectable()
export class PaymentRepository {
    constructor(
			@Inject("Paymentorder") private readonly paymentOrder: Model<OrderPaymentClass>,
    ) {}

		async createOrderPayment(paybody:any,orderbody:any){
			
			const body = {
				idorganization:orderbody.organizationId,
				paymentid:paybody.id,
				merchantId:paybody.merchantId,
				paymentStatus:paybody.status,
				paymentAmount:paybody.amount.value,
				paymentTime:paybody.created,
				paymentparams:paybody.invoice.params,
				paymentData:paybody.paymentData,
				orderId:orderbody.id,
				orderStatus:orderbody.order.status,
				orderAmount:orderbody.order.sum,
				orderItems:orderbody.order.items
			}
			
			return await this.paymentOrder.create(body)
			
		}

		async findOrderPayment(id:number){
			 const result = await this.paymentOrder.find({
				paymentid:id
			})
			console.log('check find pay',result)
			return result;
		}
}		