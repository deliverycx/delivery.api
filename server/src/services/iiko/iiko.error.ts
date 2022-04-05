import { BaseError } from "src/common/errors/base.error";

export class IikoError extends BaseError {
    constructor(error: string) {
        super(error, 400);
    }
}
