import { iiko } from "src/services/iiko/interfaces";

import { Inject, Injectable } from "@nestjs/common";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { IStopListRepository } from "../repositories/interface.repository";
import { IProductRepository } from "src/components/product/repositories/interface.repository";
import { IIiko } from "src/services/iiko/iiko.abstract";
import { IIkoAxios } from "src/services/iiko/iiko.axios";
import { IIkoAxiosRequest } from "src/services/iiko/iiko.request";


@Injectable()
export class StopListUsecase {
	constructor(
		@Inject("IIKO_AXIOS")
		private readonly axios: IIkoAxios,
		private readonly iikoAxiosRequest: IIkoAxiosRequest,
		private readonly organizationRepository: IOrganizationRepository,
		private readonly stopListRepository: IStopListRepository,
		private readonly cartRepository: ICartRepository,

	) { }

	async getAll(organizationGUID: string) {
		try {
			const resultstoplist = await this.stopListRepository.getAll(organizationGUID)
			if (resultstoplist) {
				return resultstoplist.stoplist
			}
		} catch (error) {
			//console.log(error.response.data);
		}

	}





	async stopListEventAction(
		organizationGUID: UniqueId,

	) {
		try {
			if (organizationGUID && organizationGUID !== "undefined") {
				const data = await this.iikoAxiosRequest.stopList(organizationGUID);


				const stopList =
					data.length === 0 ?
						[]
						: data
							.map((stopListArrayItem) => stopListArrayItem.items)
							.flat();


				//console.log("stoplist", organizationGUID, stopList);
				await this.stopListRepository.update(organizationGUID, stopList);
			} else {
				return []
			}

		} catch (error) {
			//console.log(error.response.data);
		}
		/*
		const organization = await this.organizationRepository.getOneByGUID(
				organizationGUID
		);
		const organizationID = organization.getId.toString();

		await this.stopListRepository.update(organizationID, stopList);

		console.log('stoplist',stopList,organizationID);	
		const stopListEntity = await this.stopListRepository.getAll(
				organizationID
		);
		

		await this.cartRepository.removeSome(
				stopListEntity.stopList.map((el) => el.productId)
		);

		return stopListEntity;
		*/


	}
}
