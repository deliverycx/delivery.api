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

@Injectable()
export class PaymentService extends IPaymentService {
    constructor(
        @InjectPinoLogger() private readonly logger: PinoLogger,
        @Inject("Paymaster") private readonly Paymaster: Paymaster,
        @Inject(REDIS) private readonly redis: RedisClient,

        private readonly organizationRepository: IOrganizationRepository,
        private readonly cartRepository: ICartRepository,
        private readonly orderUsecase: OrderUsecase,
        private readonly DeliveryService: IDeliveryService
    ) {
        super();
    }

    async captrurePayment(body: IPaymentWebhookParams) {
        const preparedBody = decodeBody<OrderDTO & { user: string }>(body);

        const orderResult = await this.orderUsecase.create(
            preparedBody.user,
            preparedBody
        );

        this.redis.set(body.hash, orderResult.getNumber.toString());
    }

    async _byCard(body: OrderDTO, userId: UniqueId): Promise<any> {
        // checking bank card support

        const organizationPaymentInfo =
            await this.organizationRepository.getPaymentsInfo(
                body.organization
            );

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
                description: 'Оплата заказа в "Старик Хинкалыч"',
                params: {
                    user: userId,
                    hash: orderHash,
                    ...encodeBody(body)
                }
            },
            protocol: {
                callbackUrl: process.env.PAYMENT_SERVICE_CALLBACK_URL,
                returnUrl: `${process.env.CLIENT_PATH}/success/${orderHash}`
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

				const q = {"merchantId":"a9a372fb-93bd-4ef4-b4d3-6df112a4b24c","testMode":true,"amount":{"currency":"RUB","value":"10.50"},"invoice":{"description":"Оплата заказа в ","params":{"user":"633bfde907e30ed25cd330d3","hash":"025b77abe64be4d2","organization":"629f21a6edc033458bbbc07c","name":"test","date":"2022-10-04 13:00:50","address_city":"Симферополь","address_street":"улица Горького","address_home":"1","address_flat":"","address_intercom":"","address_entrance":"","address_floor":"","orderType":"COURIER","phone":"+7 978 755 46 54","comment":"test","paymentMethod":"CARD"}},"protocol":{"callbackUrl":"https://cxdevproxy.ngrok.io/webhook/paymentCallback","returnUrl":"https://xn--90avg.xn--e1aybc.xn--80apgfh0ct5a.xn--p1ai/success/025b77abe64be4d2"},"reciept":{"client":{"phone":"+7 978 755 46 54"},"items":[[{"name":"Хинкали с бараниной и зеленью","quantity":5,"price":250,"vatType":"None","paymentSubject":"Commodity","paymentMethod":"FullPayment"}]]}}

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
