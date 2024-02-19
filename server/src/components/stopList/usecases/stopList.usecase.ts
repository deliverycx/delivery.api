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
				if(organizationGUID && organizationGUID !== "undefined"){
					const data = await this.axios.stopList(organizationGUID);
					if(data.length === 0){
						return []
					}
						
					const stopList = data
							.map((stopListArrayItem) => stopListArrayItem.items)
							.flat();


					return stopList
				}else{
					return []
				}
				
			} catch (error) {
				//console.log(error.response.data);
			}
			
		}



		

    async stopListEventAction(
        organizationGUID: UniqueId,
       
    ) {
			try {
				if(organizationGUID && organizationGUID !== "undefined"){
					const data = await this.axios.stopList(organizationGUID);
					
						
					const stopList =
					data.length === 0 ? 
				 	[]	
				  :	data
							.map((stopListArrayItem) => stopListArrayItem.items)
							.flat();

							

					await this.stopListRepository.update(organizationGUID, stopList);
				}else{
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
