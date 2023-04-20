import { iiko } from "src/services/iiko/interfaces";

import { Inject, Injectable } from "@nestjs/common";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { IStopListRepository } from "../repositories/interface.repository";

@Injectable()
export class StopListUsecase {
    constructor(
        private readonly organizationRepository: IOrganizationRepository,
        private readonly stopListRepository: IStopListRepository,
        private readonly cartRepository: ICartRepository
    ) {}

    async stopListEventAction(
        organizationGUID: UniqueId,
        stopList: Array<iiko.IStopListItem>
    ) {
        const organization = await this.organizationRepository.getOneByGUID(
            organizationGUID
        );
        const organizationID = organization.getId.toString();

        await this.stopListRepository.update(organizationID, stopList);

        const stopListEntity = await this.stopListRepository.getAll(
            organizationID
        );

        await this.cartRepository.removeSome(
            stopListEntity.stopList.map((el) => el.productId)
        );

        return stopListEntity;
    }
}
