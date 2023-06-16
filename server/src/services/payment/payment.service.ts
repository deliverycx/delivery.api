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
import { OrderService } from "src/components/order/services/order/order.service";

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
				private readonly paymentRepository:PaymentRepository,
				private readonly orderService:OrderService
    ) {
        super();
    }

    async captrurePayment(body: any) {
        const preparedBody = decodeBody<OrderDTO & { user: string }>({...body.invoice.params,paymentsum:body.amount.value});
				const paymentbody = {
					idorganization:body.organization,
					paymentid:body.id,
					merchantId:body.merchantId,
					paymentStatus:body.status,
					paymentAmount:body.amount.value,
					dyalPayment:{
						BarPaymentAmount:body.invoice.params.dualpayments,
						BarPaymentid:''
					},
					
					paymentTime:body.created,
					paymentparams:body.invoice.params,
					paymentData:body.paymentData,
					
				}
				
				/*
				const orderResult = await this.orderUsecase.create(
					preparedBody.user,
					preparedBody
				);
				*/
					console.log('тело в ребитт',preparedBody);
				await this.orderService.createOrderToRabbit(preparedBody.user, preparedBody,paymentbody)


			
				//const orderStatus = await this.orderUsecase.getStatusOrder()
				
				//const create = await this.paymentRepository.createOrderPayment(body,orderStatus)
				//console.log('создало заказ в админке',create);
				
				
      	//this.redis.set(body.invoice.params.hash, orderResult.getNumber.toString());
    }

		//поиск заказа в админке
		async checkPymentOrder(body:any){
			const result = await this.paymentRepository.findOrderPayment(body)
			return result
		}

		// статус заказа
		async checkPymentOrderStatus(order:any){
			const orderfomAdmin = await this.paymentRepository.findOrderPayment({orderId:order.orderId})
			
			
			if(orderfomAdmin){
				console.log('отмена - ответ из териминала',order);
				const statuses = order.text.split(':')[2].replace(/[^a-zа-яё]/gi, '')
				await this.paymentRepository.setOrderPaymentStatus(order.orderId,statuses)
				if(statuses === 'canceled'){
					console.log('отмена статус');
					const organizationPaymentInfo = await this.organizationRepository.getPaymentsInfo(orderfomAdmin.idorganization,'ip')
					
					console.log(organizationPaymentInfo);
					// отмена холдинга(оплаты)
					const result = await this.Paymaster.canselPayment(
						orderfomAdmin,
						organizationPaymentInfo.token,
						this.paymentRepository
					)

					/**
					 * возврат
					 * const status = await this.Paymaster.paymentRetunts(
							check,
							organizationPaymentInfo.token,
							this.paymentRepository
						)
						console.log('возврат',status);
						return {organizationid:check.paymentparams.orgguid,...status}
					 */
						return {organizationid:orderfomAdmin.paymentparams.orgguid,...result}
				}
			}
			
		}


		// создание оплаты для бара
		async createBarPayment(orderBody:any,localhost:string){
			const organizationPaymentInfo = await this.organizationRepository.getPaymentsInfo(orderBody.idorganization,'ooo')
			const createPayBarBody = this.Paymaster.paymasterBodyBar({orderBody,organizationPaymentInfo,localhost})
				const paymentResult = await this.Paymaster.paymentUrl(
					createPayBarBody,
					organizationPaymentInfo.token
			);

				return new RedirectEntity(
						paymentResult.url.replace("payments", "cpay")
				);
		}

		//изменение в заказе о статусе оплаты бара
		async captrurePaymentBar(body:any){
			await this.paymentRepository.setBarPaymentStatus(body)
		}



    async _byCard(body: OrderDTO, userId: UniqueId): Promise<any> {
        // checking bank card support
				
				//const organizationID = await this.organizationRepository.getOne(body.organization)
				
        const organizationPaymentInfo = await this.organizationRepository.getPaymentsInfo(body.organization,'ip')


        const { totalPrice } = await this.DeliveryService.calculatingPrices(
            userId,
            body.orderType
        );

				

        const cart = await this.cartRepository.getAll(userId);
/*
				const payMasterBody =  this.Paymaster.paymasterBody({
					orderBody:body,
					organizationPaymentInfo,
					totalPrice,
					organizationID,
					cart,
					userId
				})	
				console.log('payMasterBody',cart);

				*/
        //const orderHash = createOrderHash();

				
        const payMasterBody = {
            merchantId: organizationPaymentInfo.merchantId,
            testMode: true,
						//dualMode: true,
            amount: {
                currency: "RUB",
                value: intToDecimal(totalPrice)
            },
            invoice: {
                description: 'Оплата заказа в Старик Хинкалыч',
                params: {
                    user: userId,
                    ...encodeBody(body)
										
                }
            },
            protocol: {
                callbackUrl: 'https://cec1-89-107-138-20.ngrok-free.app/webhook/paymentCallback', //`${body.localhost}/api/webhook/paymentCallback`, //`${body.localhost}/api/webhook/paymentCallback`, //process.env.PAYMENT_SERVICE_CALLBACK_URL,
                returnUrl: `${body.localhost}/ordercreate/${body.hash}`
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

				console.log('тело оплаты',payMasterBody);
				
        const paymentResult = await this.Paymaster.paymentUrl(
            payMasterBody,
            organizationPaymentInfo.token
        );

				await this.orderUsecase.checkOrder(userId, body)	

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
