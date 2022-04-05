import { Module } from "@nestjs/common";
import { FavoriteController } from "src/components/favorites/controllers/favorite.controller";
import { favoriteProviders } from "src/components/favorites/providers/favorite.provider";
import { FavoriteRepository } from "src/components/favorites/repositories/base.repository";
import { IFavoriteRepository } from "src/components/favorites/repositories/interface.repository";
import { FavoriteUsecase } from "src/components/favorites/usecases/favorite.usecase";

@Module({
    controllers: [FavoriteController],
    providers: [
        FavoriteUsecase,
        {
            provide: IFavoriteRepository,
            useClass: FavoriteRepository
        },
        ...favoriteProviders
    ]
})
export class FavoriteModule {}
