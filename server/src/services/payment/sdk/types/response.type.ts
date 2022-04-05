export namespace PaymasterResponse {
    export interface IInvoice {
        paymentId: string;
        url: string;
    }

    export enum PaymentStatuses {
        "AUTHORIZED" = "Authorized",
        "SUCCESSED" = "Settled",
        "CANCELLED" = "Cancelled",
        "REJECTED" = "Rejected",
        "CONFIRMATION" = "Confirmation",
        "PENDING" = "Pending"
    }
}
