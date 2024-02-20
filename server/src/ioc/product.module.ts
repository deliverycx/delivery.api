import { Module } from "@nestjs/common";
import { ProductRepository } from "../components/product/repositories/base.repository";
import { IProductRepository } from "../components/product/repositories/interface.repository";
import { ProductUsecase } from "../components/product/usecases/product.usecase";
import { ProductController } from "../components/product/controllers/product.controller";
import { productProviders } from "../components/product/providers/product.provider";
import { favoriteProviders } from "src/components/favorites/providers/favorite.provider";
import { iikoAxiosProviders } from "src/services/iiko/iiko.axios";
import { NomenclatureServises } from "src/components/product/servises/nomenclature.servises";
import { AdminAxiosRequest } from "src/services/admin.request";

@Module({
    controllers: [ProductController],
    providers: [
        ProductUsecase,
				NomenclatureServises,
				AdminAxiosRequest,
        {
            provide: IProductRepository,
            useClass: ProductRepository
        },
        ...favoriteProviders,
        ...productProviders,
				...iikoAxiosProviders,
    ]
})
export class ProductModule {}
