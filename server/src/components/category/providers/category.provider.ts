import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import {
    CategoryModel,
    CategorySchema
} from "../../../database/models/category.model";

export const categoryProviders = [
    {
        provide: "Category",
        useFactory: (connection: Connection) =>
            connection.model("Category", CategorySchema),
        inject: [getConnectionToken("DatabaseConnection")]
    }
];
