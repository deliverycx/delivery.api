import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { CityModel, CitySchema } from "../../../database/models/city.model";

export const cityProviders = [
    {
        provide: "City",
        useFactory: (connection: Connection) =>
            connection.model("City", CitySchema),
        inject: [getConnectionToken("DatabaseConnection")]
    }
];
