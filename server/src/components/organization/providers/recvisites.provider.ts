import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";

import { recvisitesSchema } from "src/database/models/recvisites.model";

export const recvisitesProviders = [
    {
        provide: "Recvisites",
        useFactory: (connection: Connection) =>
            connection.model("Recvisites", recvisitesSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    }
];
