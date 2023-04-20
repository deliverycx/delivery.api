import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { CartModel, CartSchema } from "../../../database/models/cart.model";

export const cartProviders = [
    {
        provide: "Cart",
        useFactory: (connection: Connection) =>
            connection.model("Cart", CartSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    }
];
