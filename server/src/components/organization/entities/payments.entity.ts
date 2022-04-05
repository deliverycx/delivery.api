export class PaymentInfoEntity {
    constructor(
        private readonly _merchantId?: UniqueId,
        private readonly _token?: string,
        private readonly _isActive?: boolean,
        private readonly _organizationId?: UniqueId
    ) {}

    public get organizationId() {
        return this._organizationId;
    }
    public get merchantId() {
        return this._merchantId;
    }

    public get token() {
        return this._token;
    }

    public get isActive() {
        return this._isActive;
    }
}
