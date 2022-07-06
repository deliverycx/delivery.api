import { iiko } from "src/services/iiko/interfaces";
import { IIiko, IReturnCreateOrder, OrderTypesEnum } from "./iiko.abstract";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { OrderDTO } from "src/components/order/dto/order.dto";
import { Inject } from "@nestjs/common";
import {
    IDeliveryPrices,
    IDeliveryService
} from "../delivery/delivery.abstract";
import { CannotDeliveryError } from "src/components/order/errors/order.error";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { Model } from "mongoose";
import { ProductClass } from "src/database/models/product.model";
import { IIkoAxios } from "./iiko.axios";
import { StopListUsecase } from "src/components/stopList/usecases/stopList.usecase";
import { OrganizationClass } from "src/database/models/organization.model";


export class IikoService implements IIiko {
    constructor(
        @Inject("Product")
        private readonly productModel: Model<ProductClass>,

        @Inject("Organization")
        private readonly organizationModel: Model<OrganizationClass>,

        @Inject("IIKO_AXIOS")
        private readonly axios: IIkoAxios,

        private readonly DeliveryService: IDeliveryService,

        private readonly StopListUsecase: StopListUsecase,

        @InjectPinoLogger() private readonly logger?: PinoLogger
    ) {}

    /*-----------------| createOrderBody |-----------------------*/
    private async createOrderBody(
        orderInfo: OrderDTO,
        cart: Array<CartEntity>,
        deliveryPrice: number
    ) {
        const organization = await this.organizationModel.findById(
            orderInfo.organization
        );

        /*
            Получение айдишнка типа заказа
        */
        const { id: orderTypeId } = await this.getOrderTypesId(
            orderInfo.organization,
            orderInfo.orderType
        );

        /*
            Берем товар "доставка" для конкретной
            организации.
        */
        const deliveryProduct = await this.productModel.findOne({
            name: "Доставка",
            organization: orderInfo.organization
        });

        const {
            notPickup,
            deliveryPriceNotEqualZero,
            deliveryProductIsDefiend
        } = {
            notPickup: orderInfo.orderType !== OrderTypesEnum.PICKUP,
            deliveryProductIsDefiend: deliveryProduct,
            deliveryPriceNotEqualZero: deliveryPrice !== 0
        };

        const deliveryProductObject =
            notPickup && deliveryPriceNotEqualZero && deliveryProductIsDefiend
                ? {
                      id: deliveryProduct.id,
                      name: deliveryProduct.name,
                      amount: 1,
                      sum: deliveryPrice
                  }
                : undefined;

        const requestOrderItems = [
            ...cart.map((cartEl) => {
                return {
                    id: cartEl.getProductId,
                    name: cartEl.getProductName,
                    amount: cartEl.getAmount
                };
            }),
            deliveryProductObject
        ].filter(Boolean);
        

        const result = {
            organization: organization.id,
            customer: {
                name: orderInfo.name,
                phone: orderInfo.phone
            },
            order: {
                phone: orderInfo.phone,
                date: orderInfo.date,
                
                address: {
                    city: orderInfo.address.city,
                    street: orderInfo.address.street,
                    home: orderInfo.address.home,
                    apartment: orderInfo.address.flat,
                    entrance: orderInfo.address.entrance,
                    floor: orderInfo.address.floor,
                    doorphone: orderInfo.address.intercom
                },
                items: requestOrderItems,
                comment: orderInfo.comment,
                orderTypeId: orderTypeId,
                isSelfService:
                    orderInfo.orderType === OrderTypesEnum.PICKUP
                        ? "true"
                        : "false"
            }
        };

        return result;
    }

    /*-----------------| getOrderTypesId |-----------------------*/
    public async getOrderTypesId(
        organizationId: UniqueId,
        orderType: OrderTypesEnum
    ) {
        const organizationGUID = await this.organizationModel.findById(
            organizationId,
            { id: 1 }
        );

        const data = await this.axios.orderTypes(organizationGUID.id);

        const result = data.items.find((orderTypeEl) => {
            return orderTypeEl.orderServiceType.includes(orderType);
        });

        return { name: result?.name, id: result?.id };
    }

    /*-----------------|      create     |-----------------------*/
    /*
        this method send http request to iiko biz api
        and return number of order from iiko db
    */
    async create(
        cart: Array<CartEntity>,
        orderInfo: OrderDTO,
        prices: IDeliveryPrices
    ): Promise<IReturnCreateOrder> {
        const orderBody = await this.createOrderBody(
            orderInfo,
            cart,
            prices.deliveryPrice
        );

      const orderResponseInfo = await this.axios.orderCreate(orderBody);
        this.logger.info(
            `${orderInfo.phone} ${JSON.stringify(orderResponseInfo)}`
        );

        return {
            result: orderResponseInfo.number,
            problem:
                orderResponseInfo.problem?.hasProblem &&
                orderResponseInfo?.problem?.problem
        };
    }

    /*-----------------|       check      |-----------------------*/
    /*
        check opportunity delivery
    */
    async check(
        userId: UniqueId,
        cart: Array<CartEntity>,
        orderInfo: OrderDTO
    ): Promise<iiko.ICheckResult> {
        const { deliveryPrice } = await this.DeliveryService.calculatingPrices(
            userId,
            orderInfo.orderType
        );

        const orderCheckBody = await this.createOrderBody(
            orderInfo,
            cart,
            deliveryPrice
        );
    
        const data = await this.axios.checkOrder(orderCheckBody);

        return {
            numState: data.resultState,
            message: iiko.MessageResultStateEnum[`_${data.resultState}`]
        };
    }

    /*-----------------|    getStopList    |-----------------------*/
    /*
        get stop-list and sending to the client
        by websocket.
        save stop-list to the stopList collection
    */
    async getStopList(body: iiko.IWebhookEvent) {
        const data = await this.axios.stopList(body.organizationId);
        const stopList = data.stopList
            .map((stopListArrayItem) => stopListArrayItem.items)
            .flat();

        const stopListArray = stopList.map((el) => {
            return {
                ...el,
                product: el.productId
            };
        });

        const stopListEntity = await this.StopListUsecase.stopListEventAction(
            body.organizationId,
            stopListArray
        );

        return stopListEntity;
    }
		async getDiscount(
			organizationId: UniqueId,
			cart: Array<CartEntity>,
		){
			const data = await this.axios.discontList({
				organization:organizationId,
				order:{
					items:cart
				}
			});
		}
	
}
