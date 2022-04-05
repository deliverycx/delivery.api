import { Paymaster } from "../common/paymaster";

export const paymasterProvider = {
    provide: "Paymaster",
    useClass: Paymaster
};
