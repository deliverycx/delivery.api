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
import { OrderCheckDto } from "../../dto/orderCheck.dto";
import { createOrderHash } from "src/services/payment/utils/hash";
import { RedisClient } from "redis";
import { REDIS } from "src/modules/redis/redis.constants";
import { IIkoAxiosRequest } from "src/services/iiko/iiko.request";

interface IState {
	user: UniqueId;
	orderInfo: OrderCheckDto;
	cart: Array<CartEntity>;
	errors: Array<BaseError>;
}

@Injectable({ scope: Scope.REQUEST })
export class OrderCheckBuilder {
	private _state: IState = {} as IState;

	constructor(


		private readonly orderService: IIkoAxiosRequest,

		private readonly validationCountService: ValidationCount,

		private readonly OrganizationRepository: IOrganizationRepository,

		private readonly CartRepository: ICartRepository,
		@Inject(REDIS) private readonly redis: RedisClient,
	) { }

	async initialize(userId: UniqueId, orderInfo: OrderCheckDto) {
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

	async terminalIsAlive() {

		const org = await this.OrganizationRepository.getOneByGUID(this._state.orderInfo.organizationid)
		const isAlive = await this.orderService.termiralAlive(this._state.orderInfo.organizationid, org.getTerminal)
		//console.log('на чеке',isAlive,this._state.orderInfo.organizationid,org.getTerminal);
		if (!isAlive) {
			this._state.errors.push(
				new CannotDeliveryError(
					`Доставка не может быть совершена по причине: нет связи с заведением`
				)
			);
		}
		if (this._state.orderInfo.organizationStatus && this._state.orderInfo.organizationStatus !== 'WORK') {
			this._state.errors.push(
				new CannotDeliveryError(
					`Доставка не может быть совершена`
				)
			);
		}


	}

	/*
	async checkCardPaymentAviables() {
			if (this._state.orderInfo.paymentMethod !== PaymentMethods.CARD) {
					return;
			}

			const { isActive } = await this.OrganizationRepository.getPaymentsInfo(
					this._state.orderInfo.organization,
			);

			if (!isActive) {
					this._state.errors.push(
							new PaymentError("Заведение не поддерживает оплату картой")
					);
			}
	}
	*/

	async checkStopList() {
		const stoplist = await this.orderService.stopList(this._state.orderInfo.organizationid)
		const arrStoplist = stoplist.map((el) => el.product)


		const result = this._state.cart.filter((el) => {
			return arrStoplist.includes(el.getProductIdObj.toString())
		})


		if (result.length !== 0) {
			this._state.errors.push(
				new CannotDeliveryError(
					result.map((el: any) => {
						return `в стоплисте - ${el.getProductName}`
					})
				)

			);
		}


	}

	/*
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
	*/

	getResult(): string {

		this._state.errors.forEach((error) => {
			throw error;
		});
		const orderHash = createOrderHash();
		this.redis.set(
			orderHash,
			orderHash,
			"EX",
			60 * 10
		);
		return orderHash
	}
}
