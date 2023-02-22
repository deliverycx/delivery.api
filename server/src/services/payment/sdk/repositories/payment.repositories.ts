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
				dyalPayment:{
					BarPaymentAmount:paybody.invoice.params.dualpayments,
					BarPaymentid:''
				},
				
				paymentTime:paybody.created,
				paymentparams:paybody.invoice.params,
				paymentData:paybody.paymentData,
				orderId:orderbody.id,
				orderNumber:orderbody.order.number,
				orderHash:paybody.invoice.params.hash,
				orderStatus:orderbody.order.status,
				orderAmount:orderbody.order.sum,
				orderItems:orderbody.order.items
			}
			
			return await this.paymentOrder.create(body)
			
		}

		async findOrderPayment(body:any){
			 const result = await this.paymentOrder.findOne(body)
			 return result;
		}

		async setOrderPaymentStatus(orderId:string,status:string){
			const result = await this.paymentOrder.findOneAndUpdate(
				{
					orderId:orderId
				},
				{
					$set:{
						orderStatus:status
					}
				}
			)
			console.log('обновило статус заказа');
		 return result;
	 }

		 async setPaymentStatus(payid:number,status:string){
			console.log('в обновлении',payid,status);
			const result = await this.paymentOrder.findOneAndUpdate({
				paymentid:payid
			},
			{
				$set:{
					paymentStatus:status
				}
			},{
				new:true
			}
			
			)

			console.log('обновило статус оплаты');
		 return result;
 	}

	async setBarPaymentStatus(paybody:any){
		const result = await this.paymentOrder.findOneAndUpdate({
			orderId:paybody.invoice.params.orderId
		},
		{
			$set:{
				dyalPayment:{
					BarPaymentAmount:paybody.amount.value,
					BarPaymentid:paybody.id
				}
			}
		},{
			new:true
		}
		
		)
	}
	 
}		