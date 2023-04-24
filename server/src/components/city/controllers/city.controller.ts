import { Controller, Get, HttpException, HttpStatus, Query, Req, Res,Headers } from "@nestjs/common";
import { CityUsecase } from "../usecases/city.usecase";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CityEntity } from "../entities/city.entity";
import { CityQueryDTO } from "../dto/cityQuery.dto";
import { Response,Request } from "express";

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

		@Get("webhook_all")	
    async webhookgetAll(
				@Headers('authorization') headers,
				@Req() req:Request,
				@Res() response: Response,
    ) {

				const refreshToken = headers.replace('Bearer', '').trim();
				console.log('citytoken',refreshToken);
				const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcGlMb2dpbklkIjoiYzZjOWJjOGUtYzYxOC00MzdmLTgwMDgtYTc5NWY5Nzk4ZmM5IiwibmJmIjoxNjgxMjg2ODI3LCJleHAiOjE2ODEyOTA0MjcsImlhdCI6MTY4MTI4NjgyNywiaXNzIjoiaWlrbyIsImF1ZCI6ImNsaWVudHMifQ.ZAJR-BmWNs4S9Eqx7gL7jviJ5P0nVAbBwFVI99-YI88'
				if(refreshToken !== token){
					response.status(401).json({});
				} 
        const result = await this.cityUsecase.getAll("");
				
        //throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        response.status(200).json(result);
    }
}
