import { getConnectionToken } from "@nestjs/mongoose";
import { Connection, connect } from "mongoose";
import { UserModel, UserSchema } from "../../../database/models/user.model";
import { ProfileSchema } from "src/database/models/profile.model";

export const userProviders = [
    {
        provide: "User",
        useFactory: (connection: Connection) =>
            connection.model("User", UserSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    },
		{
			provide: "Profile",
			useFactory: (connection: Connection) =>
					connection.model("Profile", ProfileSchema),
			inject: [getConnectionToken("DatabaseConnection")]
	}

];
