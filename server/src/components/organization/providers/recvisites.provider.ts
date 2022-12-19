import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { OrganizationStatusSchema } from "src/database/models/organizationStatus.model";

import { recvisitesSchema } from "src/database/models/recvisites.model";

export const recvisitesProviders = [
    {
        provide: "Recvisites",
        useFactory: (connection: Connection) =>
            connection.model("Recvisites", recvisitesSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    },
		{
			provide: "organizationstatus",
			useFactory: (connection: Connection) =>
					connection.model("organizationstatus", OrganizationStatusSchema),
			inject: [getConnectionToken("DatabaseConnection")]
		}
];
