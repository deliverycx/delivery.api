import { iiko } from "src/services/iiko/interfaces";

import { Inject, Injectable } from "@nestjs/common";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { IStopListRepository } from "../repositories/interface.repository";
import { IProductRepository } from "src/components/product/repositories/interface.repository";
import { IIiko } from "src/services/iiko/iiko.abstract";
import { IIkoAxios } from "src/services/iiko/iiko.axios";


@Injectable()
export class StopListUsecase {
    constructor(
				@Inject("IIKO_AXIOS")
				private readonly axios: IIkoAxios,

        private readonly organizationRepository: IOrganizationRepository,
        private readonly stopListRepository: IStopListRepository,
        private readonly cartRepository: ICartRepository,
				
    ) {}

		async getAll(organizationGUID:string){
			try {
				if(organizationGUID){
					const data = await this.axios.stopList(organizationGUID);
					
					if(data.length === 0){
						return []
					}
						
					const stopList = data
							.map((stopListArrayItem) => stopListArrayItem.items)
							.flat();
							
					//const result = await this.stopListRepository.getAll(organizationGUID,stopList)

					return stopList
				}else{
					return []
				}
				
			} catch (error) {
				//console.log(error.response.data);
			}
			
		}



		async deleteStopList(organizationGUID:string,stopList:Array<iiko.IStopListItem>){
			return await this.stopListEventAction(organizationGUID,stopList)
		}

    async stopListEventAction(
        organizationGUID: UniqueId,
        stopList: Array<iiko.IStopListItem>
    ) {
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
				const result = await this.cartRepository.removeSome(
					stopList.map((el) => el.product)
				);
				return result
				
    }
}
