import { AxiosInstance } from "axios";
import { Axios } from "src/common/abstracts/request";
import { PaymentError } from "../models/error.model";
import { PaymasterRequest } from "../types/request.type";

import { PaymasterResponse } from "../types/response.type";

export class PaymasterRequests extends Axios {
    public _axios: AxiosInstance;

    constructor() {
        super("https://paymaster.ru", (error) => new PaymentError(error));
    }

    public async invoices(
        requestBody: PaymasterRequest.IInvoice,
        token: string
    ) {
        const { data } = await this._axios.post<PaymasterResponse.IInvoice>(
            "/api/v2/invoices",
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return data;
    }

		public async retunts(
			requestBody: PaymasterRequest.PayRetutns,
			token: string
		) {
				const { data } = await this._axios.post(
						"/api/v2/refunds",
						{
							"paymentId": String(requestBody.paymentid),
							"amount": {
								"value": Number(requestBody.paymentAmount),
								"currency": "RUB"
							}
						},
						{
								headers: {
										Authorization: `Bearer ${token}`
								}
						}
				);

				return data;
		}
}
