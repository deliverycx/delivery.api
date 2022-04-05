import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { StopListSchema } from "src/database/models/stopList.model";

export const stopListProviders = [
    {
        provide: "StopList",
        useFactory: (connection: Connection) =>
            connection.model("StopList", StopListSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    }
];
