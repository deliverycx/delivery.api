import { Controller, Get, HttpException, HttpStatus, Inject, Query } from "@nestjs/common";
import { CityUsecase } from "../usecases/city.usecase";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CityEntity } from "../entities/city.entity";
import { CityQueryDTO } from "../dto/cityQuery.dto";
import { ClientProxy } from "@nestjs/microservices";

@ApiTags("City endpoints")
@Controller("city")
export class CityController {
    constructor(
			private readonly cityUsecase: CityUsecase,
			
		) {}

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

		@Get("buid")
    async getBuId(
        @Query()
        query: CityQueryDTO
    ) {
        const result = this.cityUsecase.getBuId(
            query.id
        );
				
        //throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        return result;
    }

		@Get('hello')
	  getHello() {
	    return this.cityUsecase.getHello();
	  }

		@Get('tohello')
	  togetHello() {
	    return this.cityUsecase.togetHello();
	  }
}
