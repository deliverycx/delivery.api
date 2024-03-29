import { Module } from "@nestjs/common";
import { cartProviders } from "src/components/cart/providers/cart.provider";
import { CartRepository } from "src/components/cart/repositories/base.repository";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { organizationProviders } from "src/components/organization/providers/organization.provider";
import { recvisitesProviders } from "src/components/organization/providers/recvisites.provider";
import { OrganizationRepository } from "src/components/organization/repositories/base.repository";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { productProviders } from "src/components/product/providers/product.provider";
import { stopListProviders } from "src/components/stopList/providers/stopList.provider";
import { StopListRepository } from "src/components/stopList/repositories/base.repository";
import { IStopListRepository } from "src/components/stopList/repositories/interface.repository";
import { StopListUsecase } from "src/components/stopList/usecases/stopList.usecase";
import { iikoAxiosProviders } from "src/services/iiko/iiko.axios";
import { RedisModule } from "./redis/redis.module";
import { IIkoAxiosRequest } from "src/services/iiko/iiko.request";

@Module({
		imports:[RedisModule],
    providers: [
			RedisModule,
        ...iikoAxiosProviders,
        ...stopListProviders,
        ...cartProviders,
        ...organizationProviders,
        ...stopListProviders,
        ...productProviders,
        ...recvisitesProviders,
				IIkoAxiosRequest,
        {
            provide: IStopListRepository,
            useClass: StopListRepository
        },
        {
            provide: ICartRepository,
            useClass: CartRepository
        },
        {
            provide: StopListUsecase,
            useClass: StopListUsecase
        },
        {
            provide: IOrganizationRepository,
            useClass: OrganizationRepository
        }
    ],
    exports: [
        ...iikoAxiosProviders,
        ...stopListProviders,
        ...cartProviders,
				IIkoAxiosRequest,
        ...organizationProviders,
        ...recvisitesProviders,
        ...stopListProviders,
        ...productProviders,
        {
            provide: IStopListRepository,
            useClass: StopListRepository
        },
        {
            provide: StopListUsecase,
            useClass: StopListUsecase
        },
        {
            provide: ICartRepository,
            useClass: CartRepository
        },

        {
            provide: IOrganizationRepository,
            useClass: OrganizationRepository
        }
    ]
})
export class IikoModule {}
