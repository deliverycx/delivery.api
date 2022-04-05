import { ICityRepository } from "../repositories/interface.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CityUsecase {
    constructor(private readonly cityRepository: ICityRepository) {}

    async getAll(searchString: string) {
        const result = await this.cityRepository.getAll(searchString);

        return result;
    }
}
