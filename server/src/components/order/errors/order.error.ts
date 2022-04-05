import { BaseError } from "src/common/errors/base.error";

export class EmptyCartError extends BaseError {
    constructor() {
        super("Заказ не может быть создан, так как корзина пуста", 400);
    }
}

export class ValidationCountError extends BaseError {
    constructor(error) {
        super(error, 422);
    }
}

export class CannotDeliveryError extends BaseError {
    constructor(error) {
        super(error, 400);
    }
}
