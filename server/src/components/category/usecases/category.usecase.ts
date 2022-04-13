import { Injectable } from "@nestjs/common";
import { ICategoryRepository } from "../repositories/interface.repository";

@Injectable()
export class CategoryUsecase {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async getAll(organizationId: UniqueId) {
        const result = this.categoryRepository.getAll(organizationId);

        return result;
    }
    async getAllById(organizationId: string) {
      const result = this.categoryRepository.getAllById(organizationId);

      return result;
    }
}
