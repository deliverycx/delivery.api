import { Controller, Get, HttpStatus, Query, Req, Res } from "@nestjs/common";
import { OrganizationUsecase } from "../usecases/organization.usecase";
import { Request, Response } from "express";
import { GetAllDTO } from "../interfaces/getAll.dto";
import { ApiTags, ApiResponse, ApiBody } from "@nestjs/swagger";
import { OrganizationEntity } from "../entities/organization.entity";
import { RecvisitesEntity } from "../entities/recvisites.entity";
import { RecvisitesDTO } from "../interfaces/getRecvisites.dto";
import { IOrganizationRepository } from "../repositories/interface.repository";

@ApiTags("Organization endpoints")
@Controller("organization")
export class OrganizationController {
    constructor(
			private readonly organizationUsecase: OrganizationUsecase,
			private readonly organizationRepository: IOrganizationRepository
		) {}

    @ApiResponse({
        status: 200,
        type: [OrganizationEntity]
    })
    @Get("all")
    async getAll(
        @Query() query: GetAllDTO,
        @Res() response: Response,
        @Req() request: Request
    ) {
        const result = await this.organizationUsecase.getAll(query.cityId);
        response.status(HttpStatus.OK).json(result);
    }

    @ApiResponse({
        status: 200,
        type: [RecvisitesEntity]
    })
    @Get("recvisites")
    async getRecvisites(
        @Query() query: any, 
        @Res() response: Response
    ) {
        const result = await this.organizationUsecase.getRecvisites(
            query.organizationId
        );

        response.status(HttpStatus.OK).json(result);
    }

    @ApiResponse({
        status: 200,
        schema: {
            properties: {
                isActivePayment: { type: "boolean", example: true },
                organizationId: {
                    type: "string",
                    example: "61fdb15f942415d95559b230"
                }
            }
        }
    })
    @Get("one")
    async getOne(@Query() query: RecvisitesDTO, @Res() response: Response) {
        const result = await this.organizationUsecase.getPaymentsInfoForClient(
            query.organizationId
        );

        response.status(HttpStatus.OK).json(result);
    }
		@Get("buguid")
    async getOneORg(@Query() query: RecvisitesDTO, @Res() response: Response) {
        const result = await this.organizationUsecase.getBuID(
            query.organizationId
        );

        response.status(HttpStatus.OK).json(result);
    }

		@Get("organizationstatus")
    async getOrgStatus(@Query() query: {organization:string}) {
        return this.organizationRepository.getOrgStatus(query.organization)
    }
		@Get("organizationstatusall")
    async getOrgStatusAll(@Query() query: {organization:string}) {
        return this.organizationRepository.getOrgStatusAll(query.organization)
    }
		@Get("checkorganization")
    async checkOrg(@Query() query: {organization:string}) {
        return this.organizationRepository.getOrgStatusAll(query.organization)
    }
}
