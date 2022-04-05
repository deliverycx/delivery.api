import { Module } from "@nestjs/common";
import { ProductRepository } from "../components/product/repositories/base.repository";
import { IProductRepository } from "../components/product/repositories/interface.repository";
import { ProductUsecase } from "../components/product/usecases/product.usecase";
import { ProductController } from "../components/product/controllers/product.controller";
import { productProviders } from "../components/product/providers/product.provider";
import { favoriteProviders } from "src/components/favorites/providers/favorite.provider";

@Module({
    controllers: [ProductController],
    providers: [
        ProductUsecase,
        {
            provide: IProductRepository,
            useClass: ProductRepository
        },
        ...favoriteProviders,
        ...productProviders
    ]
})
export class ProductModule {}
