import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { OrganizationTablesSchema } from "src/database/models/organizationTables.model";
import { CartModel, CartSchema } from "../../../database/models/cart.model";

export const cartProviders = [
    {
        provide: "Cart",
        useFactory: (connection: Connection) =>
            connection.model("Cart", CartSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    },
		{
			provide: "Organizationtables",
			useFactory: (connection: Connection) =>
					connection.model("organizationtables", OrganizationTablesSchema),
			inject: [getConnectionToken("DatabaseConnection")]
	}
];
