import { userId } from "src/components/order/__TESTS__/stubs";
import { encodeBody } from "../../utils/encodeBody";
import { intToDecimal } from "../../utils/intToDecimal";
import { PaymentRepository } from "../repositories/payment.repositories";
import { PaymasterRequest } from "../types/request.type";
import { PaymasterRequests } from "./request";
import { createOrderHash } from "../../utils/hash";
import { IPayMasterBody } from "../types/paymaster.type";
import { CartEntity } from "src/components/cart/entities/cart.entity";

export class Paymaster {
    private readonly requester: PaymasterRequests;

    constructor(private readonly Repository:PaymentRepository) {
        this.requester = new PaymasterRequests();
    }

    public async paymentUrl(body: PaymasterRequest.IInvoice, token: string) {
        return this.requester.invoices(body, token);
    }

		public async paymentRetunts(order: any, token: string,paymentRepository:any) {


			const retuntpay:any = await this.requester.retunts({
				paymentid:String(order.paymentid),
				paymentAmount:Number(order.paymentAmount)
			}, token);
			return await this.statusReturnPamyMent(token,order,retuntpay.id,paymentRepository)
		}

		async statusReturnPamyMent(token:string,order:any,id:string,paymentRepository:any){
			const statuspay = await this.repeatReturnUntilSuccess(token,id)
			console.log('статус возврата старт',statuspay,order.paymentid)
			if(statuspay.status === 'Success'){
				await paymentRepository.setPaymentStatus(order.paymentid,'Return')
			}else if(statuspay.status === 'Rejected'){
				await paymentRepository.setPaymentStatus(order.paymentid,'Rejected')
			}
			console.log('статус возврата конец',statuspay);
			return statuspay
		}

		async repeatReturnUntilSuccess(token:string,id:string,counter?:number):Promise<any> {
				counter = counter || 0;
				let tik:any
				console.log('count в возврате',counter);
				return new Promise(async (resolve, reject) => {
						try {
								
								const result = await this.requester.retuntsStatus(token,id)
								
								if (result.status === 'Pending') {
										
										
										if (counter >= 5) {
											
											resolve(result);
		
											
									} else {
											tik = setTimeout(async () => {
													resolve(
															await this.repeatReturnUntilSuccess(token,id,counter + 1)
													);
											}, 5000);
									}
								}else if(result.status === 'Success'){
									
										resolve(result);
								}
								//clearTimeout(tik)
		
								
						} catch (e) {
							console.log('catch');
								reject(
									new Error(
											"Возникла не предвиденная ошибка"
									)
								);
								
						}
				})
		}

		paymasterChechBar(cart:Array<CartEntity>){
			let prices = 0
			cart.map((item:any) =>{
				if(item.productTags.includes("bar")){
					return prices += item.price
				}
			})
			return prices
		}
		

		paymasterBody({
			orderBody,
			organizationPaymentInfo,
			totalPrice,
			organizationID,
			cart
		}:IPayMasterBody){
			const orderHash = createOrderHash();

			const checkCartBar = this.paymasterChechBar(cart)
			
			if(checkCartBar){


				return {
					merchantId: organizationPaymentInfo.merchantId,
					testMode: true,
					dualMode: true,
						amount: {
								currency: "RUB",
								value: intToDecimal(totalPrice - checkCartBar)
						},
						invoice: {
								description: 'Оплата "Заказ-Бар" в Старик Хинкалыч',
								
								params: {
										user: userId,
										hash: orderHash,
										dualpayments:String(checkCartBar),
										orgguid:organizationID.getGuid, //organizationID.getGuid,
										...encodeBody(orderBody)
								}
						},
						protocol: {
								callbackUrl:`${orderBody.localhost}/api/webhook/paymentCallback`, //'https://b3b1-89-107-138-252.ngrok.io/webhook/paymentCallback', //`${body.localhost}/api/webhook/paymentCallback`, //process.env.PAYMENT_SERVICE_CALLBACK_URL,
								returnUrl: `${orderBody.localhost}/dualpayment/${orderHash}`
						},
						reciept: {
								client: {
										email: orderBody.email,
										phone: orderBody.phone
								},
								
								items: [
										cart.map((el) => {
												return {
														name: el.getProductName,
														quantity: el.getAmount,
														price: el.getPrice,
														vatType: "None",
														paymentSubject: "Commodity",
														paymentMethod: "FullPayment"
												};
										})
								]
						}
				};
			}else{
				return {
					merchantId: organizationPaymentInfo.merchantId,
					dualMode: true,
					testMode: true,
						amount: {
								currency: "RUB",
								value: intToDecimal(totalPrice)
						},
						invoice: {
								description: 'Оплата заказа в Старик Хинкалыч',
								params: {
										user: userId,
										hash: orderHash,
										orgguid:organizationID.getGuid, //organizationID.getGuid,
										...encodeBody(orderBody)
								}
						},
						protocol: {
								callbackUrl: `${orderBody.localhost}/api/webhook/paymentCallback`, //'https://b3b1-89-107-138-252.ngrok.io/webhook/paymentCallback', //`${body.localhost}/api/webhook/paymentCallback`, //process.env.PAYMENT_SERVICE_CALLBACK_URL,
								returnUrl: `${orderBody.localhost}/success/${orderHash}`
						},
						reciept: {
								client: {
										email: orderBody.email,
										phone: orderBody.phone
								},
								items: [
										cart.map((el) => {
												return {
														name: el.getProductName,
														quantity: el.getAmount,
														price: el.getPrice,
														vatType: "None",
														paymentSubject: "Commodity",
														paymentMethod: "FullPayment"
												};
										})
								]
						}
				};
			}

			
		}
}
