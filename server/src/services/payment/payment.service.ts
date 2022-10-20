import { Inject, Injectable } from "@nestjs/common";
import { IPaymentService } from "./payment.abstract";
import { IPaymentWebhookParams } from "../../components/order/dto/paymentWebhook.dto";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { OrderUsecase } from "src/components/order/usecases/order.usecase";
import { OrderDTO } from "src/components/order/dto/order.dto";
import { PaymentError } from "./payment.error";
import { IDeliveryService } from "../delivery/delivery.abstract";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { Paymaster } from "./sdk/common/paymaster";
import { encodeBody } from "./utils/encodeBody";
import { decodeBody } from "./utils/decodeBody";
import { intToDecimal } from "./utils/intToDecimal";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { REDIS } from "src/modules/redis/redis.constants";
import { RedisClient } from "redis";
import { createOrderHash } from "./utils/hash";
import { RedirectEntity } from "src/components/order/entities/redirect.entity";
import { Model } from "mongoose";
import { OrderPaymentClass } from "src/database/models/orderPayment.model";
import { PaymentRepository } from "./sdk/repositories/payment.repositories";

@Injectable()
export class PaymentService extends IPaymentService {
    constructor(
        @InjectPinoLogger() private readonly logger: PinoLogger,
        @Inject("Paymaster") private readonly Paymaster: Paymaster,
        @Inject(REDIS) private readonly redis: RedisClient,
				

        private readonly organizationRepository: IOrganizationRepository,
        private readonly cartRepository: ICartRepository,
        private readonly orderUsecase: OrderUsecase,
        private readonly DeliveryService: IDeliveryService,
				private readonly paymentRepository:PaymentRepository
    ) {
        super();
    }

    async captrurePayment(body: any) {
        const preparedBody = decodeBody<OrderDTO & { user: string }>({...body.invoice.params,paymentsum:body.amount.value});

       
				/**/
				const orderResult = await this.orderUsecase.create(
					preparedBody.user,
					preparedBody
				);


				/*
				const orderResult = {
					getNumber:'0ca1058a-4162-4c31-8beb-5e8dfa367b16'
				}	
				const orderStatus = {
					id: '0ca1058a-4162-4c31-8beb-5e8dfa367b16',
					externalNumber: null,
					organizationId: '7dcec94b-1109-439b-a27a-47ef897289ad',
					timestamp: 1665674390697,
					creationStatus: 'Success',
					errorInfo: null,
					order: {
						parentDeliveryId: null,
						customer: {
							type: 'regular',
							id: '78aae623-2159-49b1-8d9d-8ccb808624cf',
							name: 'test',
							surname: null,
							comment: '+7 978 755 46 54',
							gender: 'NotSpecified',
							inBlacklist: false,
							blacklistReason: null,
							birthdate: null
						},
						phone: '+79787554654',
						deliveryPoint: null,
						status: 'Unconfirmed',
						cancelInfo: null,
						courierInfo: null,
						completeBefore: '2022-10-13 18:34:49.365',
						whenCreated: '2022-10-13 18:19:49.490',
						whenConfirmed: null,
						whenPrinted: null,
						whenCookingCompleted: null,
						whenSended: null,
						whenDelivered: null,
						comment: 'test',
						problem: null,
						operator: null,
						marketingSource: null,
						deliveryDuration: 15,
						indexInCourierRoute: null,
						cookingStartTime: '2022-10-13 18:19:49.490',
						isDeleted: false,
						whenReceivedByApi: '2022-10-13 15:19:49.331',
						whenReceivedFromFront: '2022-10-13 15:19:50.002',
						movedFromDeliveryId: null,
						movedFromTerminalGroupId: null,
						movedFromOrganizationId: null,
						externalCourierService: null,
						movedToDeliveryId: null,
						movedToTerminalGroupId: null,
						movedToOrganizationId: null,
						sum: 300,
						number: 20,
						sourceKey: null,
						whenBillPrinted: null,
						whenClosed: null,
						conception: null,
						guestsInfo: { count: 1, splitBetweenPersons: false },
						items: [
							{
									"type": "Product",
									"product": {
											"id": "650a2b55-09f2-409e-864f-be04a135c18f",
											"name": "Хинкали с бараниной и зеленью"
									},
									"modifiers": null,
									"price": 50.0,
									"cost": 250.0,
									"pricePredefined": false,
									"positionId": "a96e3b18-fe8f-4518-9273-3c42737724fa",
									"taxPercent": null,
									"status": "Added",
									"deleted": null,
									"amount": 5.0,
									"comment": null,
									"whenPrinted": null,
									"size": null,
									"comboInformation": null
							}
					],
						combos: null,
						payments: null,
						tips: null,
						discounts: null,
						orderType: {
							id: '5b1508f9-fe5b-d6af-cb8d-043af587d5c2',
							name: 'Самовывоз',
							orderServiceType: 'DeliveryByClient'
						},
						terminalGroupId: 'fc71aa33-f710-4e8e-8e64-607992226cab',
						processedPaymentsSum: 0
					}
				}
				*/

				const orderStatus = await this.orderUsecase.getStatusOrder(orderResult.getNumber.toString())
				
				const create = await this.paymentRepository.createOrderPayment(body,orderStatus)
				console.log('создало');
				
				
      this.redis.set(body.invoice.params.hash, orderResult.getNumber.toString());
    }

		async checkPymentOrder(body:any){
			const result = await this.paymentRepository.findOrderPayment(body)
			return result
		}

		async checkPymentOrderStatus(order:any){
			const check = await this.paymentRepository.findOrderPayment({orderId:order.orderId})
			
			if(check){

				const status = order.text.split(':')[2].replace(/[^a-zа-яё]/gi, '')
				await this.paymentRepository.setOrderPaymentStatus(order.orderId,status)
				if(status === 'canceled'){
					const organizationPaymentInfo = await this.organizationPaymentInfo(check.paymentparams.organization)
					const status = await this.Paymaster.paymentRetunts(
							check,
							organizationPaymentInfo.token,
							this.paymentRepository
						)
						console.log('возврат',status);
				}
			}
			return check
		}

		async organizationPaymentInfo(id:string){
			return await this.organizationRepository.getPaymentsInfo(
				id
			);
		}

    async _byCard(body: OrderDTO, userId: UniqueId): Promise<any> {
        // checking bank card support
				

        const organizationPaymentInfo = await this.organizationPaymentInfo(body.organization)

        const { totalPrice } = await this.DeliveryService.calculatingPrices(
            userId,
            body.orderType
        );

				

        const cart = await this.cartRepository.getAll(userId);
        const orderHash = createOrderHash();
        const payMasterBody = {
            merchantId: organizationPaymentInfo.merchantId,
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
                    ...encodeBody(body)
                }
            },
            protocol: {
                callbackUrl: `${body.localhost}/api/webhook/paymentCallback`, //'https://b3b1-89-107-138-252.ngrok.io/webhook/paymentCallback', //`${body.localhost}/api/webhook/paymentCallback`, //process.env.PAYMENT_SERVICE_CALLBACK_URL,
                returnUrl: `${body.localhost}/success/${orderHash}`
            },
            reciept: {
                client: {
                    email: body.email,
                    phone: body.phone
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


				console.log('paybody',payMasterBody);
        const paymentResult = await this.Paymaster.paymentUrl(
            payMasterBody,
            organizationPaymentInfo.token
        );
        return new RedirectEntity(
            paymentResult.url.replace("payments", "cpay")
        );
    }

    async _byCash(body: OrderDTO, userId: UniqueId): Promise<RedirectEntity> {
        const orderHash = createOrderHash();
        const orderEntity = await this.orderUsecase.create(userId, body);
        this.redis.set(
            orderHash,
            orderEntity.getNumber.toString(),
            "EX",
            60 * 10
        );
        const redirectUri = `/success/${orderHash}`;

        return new RedirectEntity(redirectUri);
    }
}
