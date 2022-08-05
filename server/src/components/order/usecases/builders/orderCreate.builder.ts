import { Inject, Injectable, Scope } from "@nestjs/common";
import { rejects } from "assert";
import { BaseError } from "src/common/errors/base.error";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { IDeliveryService } from "src/services/delivery/delivery.abstract";
import { IBotService } from "src/services/duplicateBot/bot.abstract";
import { IIiko } from "src/services/iiko/iiko.abstract";
import { OrderDTO } from "../../dto/order.dto";
import { OrderEntity } from "../../entities/order.entity";
import { CannotDeliveryError } from "../../errors/order.error";
import { IOrderRepository } from "../../repositores/interface.repository";

interface IState {
    user: UniqueId;
    orderInfo: OrderDTO;
    cart: Array<CartEntity>;
    orderNumber: number | string;
}

@Injectable({ scope: Scope.REQUEST })
export class OrderCreateBuilder {
    private _state: IState = {} as IState;

    constructor(
        @Inject("IIiko")
        private readonly orderService: IIiko,

        private readonly orderRepository: IOrderRepository,
        private readonly CartRepository: ICartRepository,

        private readonly OrganizationRepository: IOrganizationRepository,

        private readonly DeliveryService: IDeliveryService,

        private readonly botService: IBotService
    ) {}

    async initialize(userId: UniqueId, orderInfo: OrderDTO) {
        this._state.orderInfo = orderInfo;
        this._state.user = userId;

        this._state.cart = await this.CartRepository.getAll(userId);
    }

    private repeatOrderUntilSuccess(organizationId:string, orderId:string,counter?:number) {
        counter = counter || 0;
				console.log('count',counter);
        return new Promise(async (resolve, reject) => {
            try {
                
                const result = await this.orderService.statusOrder(organizationId,orderId)

                if (result.creationStatus === 'InProgress') {
                    //reject(new CannotDeliveryError(result.errorInfo));
                }else if(!result.errorInfo && result.creationStatus === 'Success'){
										//resolve(result);
								}
								

                
            } catch (e) {
							console.log('catch');
							
                if (counter >= 3) {
                    reject(
                        new CannotDeliveryError(
                            "Возникла не предвиденная ошибка"
                        )
                    );
                } else {
                    setTimeout(async () => {
                        resolve(
                            await this.repeatOrderUntilSuccess(organizationId,orderId,counter + 1)
                        );
                    }, 5000);
                }
            }
        }).catch((E) => {
            throw E;
        });
    }

    async createOrder() {
        const user = this._state.user;
        const orderInfo = this._state.orderInfo;

        const cart = await this.CartRepository.getAll(user);

        const deliveryPrices = await this.DeliveryService.calculatingPrices(
            this._state.user,
            orderInfo.orderType
        );

        const orderInfoPross = await this.orderService.create(
            cart,
            orderInfo,
            deliveryPrices
        );

				console.log('start');
				const q = await this.repeatOrderUntilSuccess(orderInfoPross.organizationId,orderInfoPross.id)
				console.log('status',q);

				

				/*
        if (problem) {
            throw new CannotDeliveryError(problem);
        }
				*/


        await this.orderRepository.create(
            user,
            deliveryPrices.totalPrice,
            '123'
        );

        this._state.orderNumber = '123';

        await this.CartRepository.removeAll(user);
    }

    async duplicateOrder() {
        const {
            address: { city, street, home },
            name,
            phone,
            organization,
            comment,
            orderType
        } = this._state.orderInfo;

        const address = `${city}, улица ${street}, д. ${home}`;
        const customer = {
            name,
            phone
        };

        const { getGuid } = await this.OrganizationRepository.getOne(
            organization
      );
      
      

        const { name: orderTypeName } = await this.orderService.getOrderTypesId(
            organization,
            orderType
      );

      console.log('orderinfo', this._state.orderInfo);
      

        this.botService.sendDuplicate(
            address,
            customer,
            comment,
            getGuid,
            this._state.cart,
            orderTypeName
        );
    }

    getOrderEntity(): OrderEntity {
        return new OrderEntity(this._state.orderNumber);
    }
}
