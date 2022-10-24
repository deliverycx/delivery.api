import { Inject, Injectable, Scope } from "@nestjs/common";
import { BaseError } from "src/common/errors/base.error";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { IIiko } from "src/services/iiko/iiko.abstract";
import { iiko } from "src/services/iiko/interfaces";
import { PaymentMethods } from "src/services/payment/payment.abstract";
import { PaymentError } from "src/services/payment/payment.error";
import { OrderDTO } from "../../dto/order.dto";
import {
    CannotDeliveryError,
    EmptyCartError,
    ValidationCountError
} from "../../errors/order.error";
import { ValidationCount } from "../../services/validationCount/validationCount.service";

interface IState {
    user: UniqueId;
    orderInfo: OrderDTO;
    cart: Array<CartEntity>;
    errors: Array<BaseError>;
}

@Injectable({ scope: Scope.REQUEST })
export class OrderCheckBuilder {
    private _state: IState = {} as IState;

    constructor(
        @Inject("IIiko")
        private readonly orderService: IIiko,

        private readonly validationCountService: ValidationCount,

        private readonly OrganizationRepository: IOrganizationRepository,

        private readonly CartRepository: ICartRepository
    ) {}

    async initialize(userId: UniqueId, orderInfo: OrderDTO) {
        this._state.orderInfo = orderInfo;
        this._state.user = userId;
        this._state.errors = [];

        this._state.cart = await this.CartRepository.getAll(userId);
    }

    async validateCart() {
        if (!this._state.cart.length) {
            this._state.errors.push(new EmptyCartError());
        }
    }

    async validateCount() {
        const validationResult = this.validationCountService.validate(
            this._state.cart
        );

        if (Object.keys(validationResult).length) {
            this._state.errors.push(new ValidationCountError(validationResult));
        }
    }

    async checkCardPaymentAviables() {
        if (this._state.orderInfo.paymentMethod !== PaymentMethods.CARD) {
            return;
        }

        const { isActive } = await this.OrganizationRepository.getPaymentsInfo(
            this._state.orderInfo.organization
        );

        if (!isActive) {
            this._state.errors.push(
                new PaymentError("Заведение не поддерживает оплату картой")
            );
        }
    }

		async checkStopList(){
			
			const organization = await this.OrganizationRepository.getOne(this._state.orderInfo.organization)
			const organizationID = organization.getGuid.toString();
			const stoplist = await this.orderService.getStopList(organizationID)
			const arrStoplist = stoplist.map((el) => el.product)

			
			const result = this._state.cart.filter((el) =>{
				return arrStoplist.includes(el.getProductIdObj.toString())
			})

			
			this._state.errors.push(
				new CannotDeliveryError(
					result.map((el:any) =>{
						return `в стоплисте - ${el.getProductName}`
					})
				)
				
			);
			
		}

    async serviceValidate() {
        const { cart, orderInfo, user } = this._state;

        const result = await this.orderService.check(user, cart, orderInfo);

        if (result.numState !== iiko.ResultStateEnum.Success) {
            this._state.errors.push(
                new CannotDeliveryError(
                    `Доставка не может быть совершена по причине ${result.message}`
                )
            );
        }
    }

    getResult(): void {
        this._state.errors.forEach((error) => {
            throw error;
        });
    }
}
