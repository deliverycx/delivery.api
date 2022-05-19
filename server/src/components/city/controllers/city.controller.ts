import { Controller, Get, HttpException, HttpStatus, Query } from "@nestjs/common";
import { CityUsecase } from "../usecases/city.usecase";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CityEntity } from "../entities/city.entity";
import { CityQueryDTO } from "../dto/cityQuery.dto";

@ApiTags("City endpoints")
@Controller("city")
export class CityController {
    constructor(private readonly cityUsecase: CityUsecase) {}

    @ApiResponse({
        status: 200,
        type: [CityEntity]
    })
    @Get("all")
    async getAll(
        @Query()
        query: CityQueryDTO
    ) {
        const result = this.cityUsecase.getAll(
            query.search ? query.search : ""
        );
				
        //throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        return result;
    }
}
