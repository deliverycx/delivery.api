import { Paymaster } from "../common/paymaster";
import { PaymasterRequest } from "../types/request.type";
import { merchantId, token } from "./stubs/main.stub";

describe("Paymaster SDK", () => {
    let PaymasterInstance: Paymaster;

    beforeAll(() => {
        PaymasterInstance = new Paymaster();
    });

    describe("request", () => {
        it("should return `payment url`", (done) => {
            const body: PaymasterRequest.IInvoice = {
                merchantId,
                testMode: true,
                amount: {
                    currency: "RUB",
                    value: "2.00"
                },
                invoice: {
                    description: "test payment"
                }
            };

            PaymasterInstance.paymentUrl(body, token)
                .then((res) => {
                    expect(res).toHaveProperty("url");
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        }, 10000);
    });
});
