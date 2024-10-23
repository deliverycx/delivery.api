import { userId } from "src/components/order/__TESTS__/stubs";
import { encodeBody } from "../../utils/encodeBody";
import { intToDecimal } from "../../utils/intToDecimal";
import { PaymentRepository } from "../repositories/payment.repositories";
import { PaymasterRequest } from "../types/request.type";
import { PaymasterRequests } from "./request";
import { createOrderHash } from "../../utils/hash";
import { IPayMasterBody } from "../types/paymaster.type";
import { CartEntity } from "src/components/cart/entities/cart.entity";


const paycalback = (localhost?: any) => `${localhost}/api/webhook/paymentCallback`  //'https://6f19-89-107-138-213.ngrok.io/webhook/paymentCallback' // `${body.localhost}/api/webhook/paymentCallback`
const paycalbackBar = (localhost?: any) => `${localhost}/api/webhook/paymentCallbackBar`  //'https://6f19-89-107-138-213.ngrok.io/webhook/paymentCallbackBar' // `${body.localhost}/api/webhook/paymentCallbackBar`

export class Paymaster {
	private readonly requester: PaymasterRequests;

	constructor(private readonly Repository: PaymentRepository) {
		this.requester = new PaymasterRequests();
	}

	public async paymentUrl(body: PaymasterRequest.IInvoice, token: string) {
		return this.requester.invoices(body, token);
	}


	// возврат
	public async paymentRetunts(order: any, token: string, paymentRepository: any) {


		const retuntpay: any = await this.requester.retunts({
			paymentid: String(order.paymentid),
			paymentAmount: Number(order.paymentAmount)
		}, token);
		return await this.statusReturnPamyMent(token, order, retuntpay.id, paymentRepository)
	}

	// возврат статус в адмике
	async statusReturnPamyMent(token: string, order: any, id: string, paymentRepository: any) {
		const statuspay = await this.repeatReturnUntilSuccess(token, id)
		console.log('статус возврата старт', statuspay, order.paymentid)
		if (statuspay.status === 'Success') {
			await paymentRepository.setPaymentStatus(order.paymentid, 'Return')
		} else if (statuspay.status === 'Rejected') {
			await paymentRepository.setPaymentStatus(order.paymentid, 'Rejected')
		}
		console.log('статус возврата конец', statuspay);
		return statuspay
	}

	// возврат проверка подверждения из паумастера
	async repeatReturnUntilSuccess(token: string, id: string, counter?: number): Promise<any> {
		counter = counter || 0;
		let tik: any
		console.log('count в возврате', counter);
		return new Promise(async (resolve, reject) => {
			try {

				const result = await this.requester.retuntsStatus(token, id)

				if (result.status === 'Pending') {


					if (counter >= 5) {

						resolve(result);


					} else {
						tik = setTimeout(async () => {
							resolve(
								await this.repeatReturnUntilSuccess(token, id, counter + 1)
							);
						}, 5000);
					}
				} else if (result.status === 'Success') {

					resolve(result);
				}
				//clearTimeout(tik)


			} catch (e) {
				console.log('catch');
				reject(
					new Error(
						"Возникла непредвиденная ошибка"
					)
				);

			}
		})
	}


	async canselPayment(order: any, token: string, paymentRepository: any) {
		await paymentRepository.setPaymentStatus(order.paymentid, 'Cancelled')
		await this.requester.canselPayment(order.paymentid, token);
		return {
			paymentId: order.paymentid
		}
	}

	paymasterChechBar(cart: Array<CartEntity>) {
		let prices = 0
		cart.map((item: any) => {
			if (item.productTags.includes("bar")) {
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
		cart,
		userId
	}: IPayMasterBody) {
		const orderHash = createOrderHash();

		const checkCartBar = this.paymasterChechBar(cart)

		if (checkCartBar) {


			return {
				merchantId: organizationPaymentInfo.merchantId,
				//testMode: true,
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
						dualpayments: String(checkCartBar),
						orgguid: organizationID, //organizationID.getGuid,
						...encodeBody(orderBody)
					}
				},
				protocol: {
					callbackUrl: paycalback(orderBody.localhost), //paycalback(), //paycalback(body.localhost), //`${body.localhost}/api/webhook/paymentCallback`, //process.env.PAYMENT_SERVICE_CALLBACK_URL,
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
		} else {
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
						orgguid: organizationID, //organizationID.getGuid,
						...encodeBody(orderBody)
					}
				},
				protocol: {
					callbackUrl: "https://xn--80apgfh0ct5a.xn--p1ai/api/webhook/paymentCallback", ////paycalback(body.localhost)   'https://b3b1-89-107-138-252.ngrok.io/webhook/paymentCallback', //`${body.localhost}/api/webhook/paymentCallback`, //process.env.PAYMENT_SERVICE_CALLBACK_URL,
					returnUrl: orderBody.localhost
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


	paymasterBodyBar({ orderBody, organizationPaymentInfo, localhost }: any) {
		/**/
		return {
			merchantId: organizationPaymentInfo.merchantId,
			testMode: true,
			dualMode: true,
			amount: {
				currency: "RUB",
				value: orderBody.dyalPayment.BarPaymentAmount
			},
			invoice: {
				description: 'Оплата "Бар" в Старик Хинкалыч',

				params: {
					idorganization: orderBody.idorganization,
					orderId: orderBody.orderId,
					orderHash: orderBody.orderHash
				}
			},
			protocol: {
				callbackUrl: "https://xn--80apgfh0ct5a.xn--p1ai/api/webhook/paymentCallback", //paycalback(body.localhost), //`${body.localhost}/api/webhook/paymentCallback`, //process.env.PAYMENT_SERVICE_CALLBACK_URL,
				returnUrl: `${localhost}/success/${orderBody.orderHash}`
			},

		}

	}
}
