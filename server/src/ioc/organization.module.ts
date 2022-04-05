import { Module } from "@nestjs/common";
import { OrganizationController } from "src/components/organization/controllers/organization.controller";
import { organizationProviders } from "src/components/organization/providers/organization.provider";
import { recvisitesProviders } from "src/components/organization/providers/recvisites.provider";
import { OrganizationRepository } from "src/components/organization/repositories/base.repository";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { OrganizationUsecase } from "src/components/organization/usecases/organization.usecase";

@Module({
    controllers: [OrganizationController],
    providers: [
        OrganizationUsecase,
        {
            provide: IOrganizationRepository,
            useClass: OrganizationRepository
        },
        ...organizationProviders,
        ...recvisitesProviders
    ]
})
export class OrganizationModule {}
