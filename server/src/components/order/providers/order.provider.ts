import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { OrderModel, OrderSchema } from "src/database/models/order.model";

export const orderProviders = [
   
		{
			provide: "Order",
			useFactory: (connection: Connection) =>
					connection.model("Order", OrderSchema),
			inject: [getConnectionToken("ADMINDatabaseConnection")]
		}
];
