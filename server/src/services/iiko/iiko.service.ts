import { iiko } from "src/services/iiko/interfaces";
import { constOrderPaymentTypes, IIiko, IReturnCreateOrder, OrderTypesEnum } from "./iiko.abstract";
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
import { string } from 'joi';


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
										type: "Product",
                    productId: cartEl.getProductId,
                    modifiers: [],
                    amount: cartEl.getAmount
                };
            }),
            //deliveryProductObject
        ].filter(Boolean);

				

				/**
				 * coordinates: orderInfo.address.cordAdress.length !== 0 
									? {
										latitude: orderInfo.address.cordAdress[0],
										longitude: orderInfo.address.cordAdress[1]			
									} : null,
				 */

				const terminal = await this.axios.termiralGroops(organization.id)

				if(orderInfo.orderType === OrderTypesEnum.PICKUP){
					return {
						organizationId: organization.id,
						terminalGroupId:terminal,
						createOrderSettings: {
							mode: "Async"
						},
            order: {
                phone: orderInfo.phone,
                //completeBefore: orderInfo.date,
                customer: {
									name: orderInfo.name,
									comment: orderInfo.phone
								},
								guests: {
									count: 1,
									splitBetweenPersons: false
								},
                items: requestOrderItems,
                comment: orderInfo.comment,
                orderTypeId: orderTypeId,
								/*
                orderServiceType:
                    orderInfo.orderType === OrderTypesEnum.PICKUP
                        ? "DeliveryPickUp"
                        : "DeliveryByCourier"
								*/					
            }
        	};
				} else if(orderInfo.orderType === OrderTypesEnum.ONSPOT){
					return {
							organizationId: organization.id,
							terminalGroupId:terminal,
							createOrderSettings: {
								mode: "Async"
							},
	            order: {
	                phone: orderInfo.phone,
	                //completeBefore: orderInfo.date,
	                customer: {
										name: orderInfo.name,
										comment: orderInfo.phone
									},
									tableIds: [
										orderInfo.orderTable.id
									],
									guests: {
										count: 1,
										splitBetweenPersons: false
									},
	                items: requestOrderItems,
	                comment: orderInfo.comment,
									payments:
									orderInfo.paymentMethod === constOrderPaymentTypes.CARD
									? [
											{
											"paymentTypeKind": "Card",
											"sum": orderInfo.paymentsum,
											"paymentTypeId": "1032a471-be2c-434f-b8c0-9bd686d8b2b5",
											"isProcessedExternally": true
											}
									]
									: null
	            }
	        	};
				}else{
					return {
						organizationId: organization.id,
						terminalGroupId:terminal,
						createOrderSettings: {
							mode: "Async"
						},
            order: {
                phone: orderInfo.phone,
                //completeBefore: orderInfo.date,
                customer: {
									name: orderInfo.name,
									comment: orderInfo.phone
								},
								deliveryPoint:{
									
									address:{
										street:{
											classifierId: orderInfo.address.kladrid, //orderInfo.address.street
											city:orderInfo.address.city
										},
										house:orderInfo.address.home,
										floor:orderInfo.address.floor,
										flat:orderInfo.address.flat,
										entrance:orderInfo.address.entrance,
										doorphone:orderInfo.address.intercom
									},
									comment:`${orderInfo.address.street},${orderInfo.address.home}`
								},
								
								guests: {
									count: 1,
									splitBetweenPersons: false
								},
                items: requestOrderItems,
                comment: orderInfo.comment,
                orderTypeId:orderTypeId,
								payments:
									orderInfo.paymentMethod === constOrderPaymentTypes.BYCARD
									? [
												{
												"paymentTypeKind": "Card",
												"sum": deliveryPrice,
												"paymentTypeId": "dfeb1b1e-36bb-4861-baf8-03be367e169a",
												
												}
										] :
									 orderInfo.paymentMethod === constOrderPaymentTypes.CARD 
									? [
												{
												"paymentTypeKind": "Card",
												"sum": orderInfo.paymentsum,
												"paymentTypeId": "f2cc4be8-e7cb-405c-a4d8-c2712b5dc740",
												"isProcessedExternally": true
												}
										]
									: null

								/*
                orderServiceType:
                    orderInfo.orderType === OrderTypesEnum.PICKUP
                        ? "DeliveryPickUp"
                        : "DeliveryByCourier"
								*/					
            }
        	};
				}
        
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
				

        const result = data.orderTypes[0].items.find((orderTypeEl) => {
					
					switch(orderType){
						case OrderTypesEnum.PICKUP :
							return orderTypeEl.id === '5b1508f9-fe5b-d6af-cb8d-043af587d5c2' && orderTypeEl
						case OrderTypesEnum.COURIER :
							return orderTypeEl.id === '9ee06fcc-8233-46fa-b74d-ff6f50128afb' && orderTypeEl
						case OrderTypesEnum.ONSPOT :
							return orderTypeEl.id === 'bbbef4dc-5a02-7ea3-81d3-826f4e8bb3e0' && orderTypeEl
					}
					/*
            const type = orderTypeEl.orderServiceType.includes(orderType);
						
						return type
						*/
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
    ): Promise<any> {

        const orderBody = await this.createOrderBody(
            orderInfo,
            cart,
            prices.totalPrice
        );

					
			/* */
      const orderResponseInfo = orderInfo.orderType ===  OrderTypesEnum.ONSPOT
				? await this.axios.orderCreate(orderBody) 
				: await this.axios.orderCreateDelivery(orderBody);

				/*
        this.logger.info(
            `${orderInfo.phone} ${JSON.stringify(orderResponseInfo)}`
        );
					*/
				
			/*
        return {
            result: orderResponseInfo.id,
            problem:orderResponseInfo.errorInfo
        };
				*/
				return orderResponseInfo

				
    }

		async statusOrder(organizationId:string,orderIds:string,orderTypes:string){
			const statusOrder = orderTypes === OrderTypesEnum.ONSPOT 
				? await this.axios.orderCheckStatusOrder({
					organizationIds:[organizationId],
					orderIds:[orderIds]
				})
				: await this.axios.orderCheckStatusOrderDelivery({
				organizationId:organizationId,
				orderIds:[orderIds]
			})
			return statusOrder
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
    async getStopList(organizationId:string) {
			const stoplist = await this.StopListUsecase.stopListEventAction(organizationId)
			return stoplist
    }
		async getDiscount(
			organizationId: UniqueId,
			cart: Array<CartEntity>,
		){

			/*
			const data = await this.axios.discontList({
				organization:organizationId,
				order:{
					items:cart
				}
			});
			*/
		}

		async getTerminalLive(
			organizationId: UniqueId,
		){

			return this.axios.termiralAlive(organizationId)
		}


		async getStreetCityIkko({organizationId}){
			const result = await this.axios.getOrganization(organizationId)
			return this.axios.getStreetCity(organizationId,result.defaultDeliveryCityId)
		}

		async updatePayment(body:any){

			const paybody = {
				"organizationId": body.organization,
				"orderId": body.orderId,
				"payments": [
					{
						"paymentTypeKind": "Card",
						"sum": body.orderAmount,
						"paymentTypeId": "f2cc4be8-e7cb-405c-a4d8-c2712b5dc740",
						"isProcessedExternally": true
						
					}
				]
			}

			await this.axios.updatePaymentIIkko(paybody)
		}

		async updateOrderProblem(body:any,problems:any){
			await this.axios.orderProblem(body,problems)
		}
	
}
