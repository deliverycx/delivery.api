import { PaymasterRequest } from "../types/request.type";
import { PaymasterRequests } from "./request";

export class Paymaster {
    private readonly requester: PaymasterRequests;

    constructor() {
        this.requester = new PaymasterRequests();
    }

    public async paymentUrl(body: PaymasterRequest.IInvoice, token: string) {
        return this.requester.invoices(body, token);
    }
}
