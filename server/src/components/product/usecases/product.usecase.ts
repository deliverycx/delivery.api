import { IProductRepository } from "../repositories/interface.repository";
import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../errors/product.error";
import { IStopListRepository } from "src/components/stopList/repositories/interface.repository";
import { IIkoAxios } from "src/services/iiko/iiko.axios";
import { NomenclatureServises } from "../servises/nomenclature.servises";

@Injectable()
export class ProductUsecase {
    constructor(
			private readonly productRepository: IProductRepository,
			@Inject("IIKO_AXIOS")
      private readonly axios: IIkoAxios,
			private readonly nomenclatureServises:NomenclatureServises
		) {}

    async getOne(productId: UniqueId, userId: UniqueId) {
        const result = await this.productRepository.getOne(productId, userId);
        if (!result.getId) {
            throw new NotFoundError(`Товар с ID ${productId} не найден`);
        }

        return result;
    }

    async getFavorites(userId: UniqueId) {
        const result = await this.productRepository.getFavorites(userId);

        return result;
    }

    async getAll(categoryId: UniqueId, userId: UniqueId) {
        const isFind = await this.productRepository.getAll(categoryId, userId);

        

        const result = await this.productRepository.getAll(categoryId, userId);

        return result;
    }


		async getAllNomenClature(organization: string) {
		  const result = await this.nomenclatureServises.getNomenClature(organization)
			return result
		}

    async search(
        searchString: string,
        organizationId: UniqueId,
        userId: UniqueId
    ) {
        const result = await this.productRepository.getBySearch(
            searchString,
            organizationId,
            userId
        );

        return result;
    }
}
