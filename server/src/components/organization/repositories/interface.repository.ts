import { OrganizationEntity } from "../entities/organization.entity";
import { RecvisitesEntity } from "../entities/recvisites.entity";
import { PaymentInfoEntity } from "../entities/payments.entity";

export abstract class IOrganizationRepository {
    abstract getAll(cityId: UniqueId): Promise<Array<OrganizationEntity>>;
    abstract getOneByGUID(id: UniqueId): Promise<OrganizationEntity>;
    abstract getRecvisites(organizationId: UniqueId): Promise<RecvisitesEntity>;
    abstract getOne(id: UniqueId): Promise<OrganizationEntity>;
		abstract filtersMetod(data: any,cityid:string): any;
		abstract pointSerchMetod(data: string,cityid:string): any;
    abstract getPaymentsInfo(
        organizationId: UniqueId,
				type?:string
    ): Promise<any>;
		abstract getOrgStatus(organization:string): Promise<any>
		abstract getOrgStatusAll(organization:string): Promise<any>
}
