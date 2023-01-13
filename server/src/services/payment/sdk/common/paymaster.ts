import { PaymentRepository } from "../repositories/payment.repositories";
import { PaymasterRequest } from "../types/request.type";
import { PaymasterRequests } from "./request";

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
}
