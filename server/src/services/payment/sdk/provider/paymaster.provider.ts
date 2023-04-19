import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { OrderPaymentSchema } from "src/database/models/orderPayment.model";
import { Paymaster } from "../common/paymaster";

export const paymasterProvider = [
	{
    provide: "Paymaster",
    useClass: Paymaster
	},
	{
		provide: "Paymentorder",
		useFactory: (connection: Connection) =>
				connection.model("Paymentorder", OrderPaymentSchema),
		inject: [getConnectionToken("ADMINDatabaseConnection")]
	}
]