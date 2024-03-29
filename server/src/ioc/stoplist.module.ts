import { Module } from "@nestjs/common";
import { cartProviders } from "src/components/cart/providers/cart.provider";
import { CartRepository } from "src/components/cart/repositories/base.repository";
import { ICartRepository } from "src/components/cart/repositories/interface.repository";
import { organizationProviders } from "src/components/organization/providers/organization.provider";
import { recvisitesProviders } from "src/components/organization/providers/recvisites.provider";
import { OrganizationRepository } from "src/components/organization/repositories/base.repository";
import { IOrganizationRepository } from "src/components/organization/repositories/interface.repository";
import { productProviders } from "src/components/product/providers/product.provider";
import { StopListController } from "src/components/stopList/controllers/stopList.controller";
import { stopListProviders } from "src/components/stopList/providers/stopList.provider";
import { StopListRepository } from "src/components/stopList/repositories/base.repository";
import { IStopListRepository } from "src/components/stopList/repositories/interface.repository";
import { StopListUsecase } from "src/components/stopList/usecases/stopList.usecase";
import { IikoModule } from "src/modules/iiko.module";
import { RedisModule } from "src/modules/redis/redis.module";
import { iikoAxiosProviders } from "src/services/iiko/iiko.axios";
import { IIkoAxiosRequest } from "src/services/iiko/iiko.request";
import { IikoService } from "src/services/iiko/iiko.service";

@Module({
	imports:[RedisModule],
	controllers: [StopListController],
	providers: [
			StopListUsecase,
			{ provide: IStopListRepository, useClass: StopListRepository },
			{ provide: ICartRepository, useClass: CartRepository },
			{ provide: IOrganizationRepository, useClass: OrganizationRepository },
			...iikoAxiosProviders,
			IIkoAxiosRequest,
			...stopListProviders,
			...productProviders,
			...cartProviders,
			...organizationProviders,
			...recvisitesProviders
	]
})
export class StopListModule {}