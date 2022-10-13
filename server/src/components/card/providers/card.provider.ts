import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { CardModel, CardSchema } from "src/database/models/card.model";
import { testSchema } from "src/database/models/test.model";

export const cardProviders = [
    {
        provide: "Card",
        useFactory: (connection: Connection) =>
            connection.model("Card", CardSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    },
		{
			provide: "Test",
			useFactory: (connection: Connection) =>
					connection.model("Test", testSchema),
			inject: [getConnectionToken("ADMINDatabaseConnection")]
	}
];
