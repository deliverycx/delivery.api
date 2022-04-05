import { BaseError } from "src/common/errors/base.error";

export class PaymentError extends BaseError {
    constructor(error) {
        super(error, 400);
    }
}
