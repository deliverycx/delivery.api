import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";
import { PaymentMethods } from "src/services/payment/payment.abstract";
import { PaymasterResponse } from "src/services/payment/sdk/types/response.type";

export interface IPaymentWebhookParams {
    user: string;
    hash: string;
    body_organization: string;
    body_name: string;
    body_address_city: string;
    body_address_street: string;
    body_address_home: string;
    body_address_flat: string;
    body_address_intercom: string;
    body_address_entrance: string;
    body_address_floor: string;
    body_orderType: OrderTypesEnum;
    body_phone: string;
    body_comment: string;
    body_paymentMethod: PaymentMethods;
    body_email: string;
}

export class IPaymentWebhookDto {
    status: PaymasterResponse.PaymentStatuses;
    id: number;
    created: string;
    testMode: boolean;
    merchantId: UniqueId;
    amount: { value: number; currency: string };
    invoice: { description: string; params: IPaymentWebhookParams };
    paymentData: { paymentMethod: string; paymentInstrumentTitle: string };
}
