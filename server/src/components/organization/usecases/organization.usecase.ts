import { Injectable } from "@nestjs/common";
import { IOrganizationRepository } from "../repositories/interface.repository";

@Injectable()
export class OrganizationUsecase {
    constructor(
        private readonly organizationRepository: IOrganizationRepository
    ) {}

    async getAll(cityId: UniqueId) {
        const result = await this.organizationRepository.getAll(cityId);
				console.log(result);
        return result;
    }

    async getRecvisites(organizationId: UniqueId) {
        const result = await this.organizationRepository.getRecvisites(
            organizationId
        );

        return result;
    }

    async getPaymentsInfoForClient(organizationId: UniqueId) {
        const { isActive, organizationId: id } =
            await this.organizationRepository.getPaymentsInfo(organizationId);

        return {
            isActivePayment: isActive,
            organizationId: id
        };
    }
		async getBuID(orgid: UniqueId) {
			const result = await this.organizationRepository.getOneByGUID(orgid);
			console.log(result);
			return result;
	}
}
