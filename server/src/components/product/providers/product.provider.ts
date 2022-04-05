import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import {
    ProductModel,
    ProductSchema
} from "../../../database/models/product.model";

export const productProviders = [
    {
        provide: "Product",
        useFactory: (connection: Connection) =>
            connection.model("Product", ProductSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    }
];
