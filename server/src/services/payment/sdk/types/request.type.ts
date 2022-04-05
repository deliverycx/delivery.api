export namespace PaymasterRequest {
    export interface IInvoice {
        merchantId: string;
        testMode?: boolean;
        createToken?: boolean;
        invoice: {
            description: string;
            params?: Object;
        };
        amount: {
            value: string;
            currency: string;
        };
        protocol?: {
            returnUrl?: string;
            callbackUrl?: string;
        };
        receipt?: {
            client: object;
            itmes: Array<object>;
        };
    }
}
