import { BaseError } from "src/common/errors/base.error";

export class NotFoundError extends BaseError {
    constructor(error) {
        super(error, 404);
    }
}
