import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import {
    FavoriteModel,
    FavoriteSchema
} from "src/database/models/favorite.model";

export const favoriteProviders = [
    {
        provide: "Favorite",
        useFactory: (connection: Connection) =>
            connection.model("Favorite", FavoriteSchema),
        inject: [getConnectionToken("DatabaseConnection")]
    }
];
