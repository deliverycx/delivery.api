import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";

import { OrganizationSchema } from "src/database/models/organization.model";
import { OrganizationfilterSchema } from "src/database/models/organizationFilter.model";
import { OrganizationStatusSchema } from "src/database/models/organizationStatus.model";
import { PaymentServiceDataSchema } from "src/database/models/payment.model";

export const organizationProviders = [
    {
        provide: "Organization",
        useFactory: (connection: Connection) =>
            connection.model("Organization", OrganizationSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    },
		{
			provide: "Organizationfilter",
			useFactory: (connection: Connection) =>
					connection.model("Organizationfilter", OrganizationfilterSchema),
			inject: [getConnectionToken("DatabaseConnection")]
		},
    {
        provide: "PaymentServiceData",
        useFactory: (connection: Connection) =>
            connection.model("PaymentInfo", PaymentServiceDataSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    }
];
