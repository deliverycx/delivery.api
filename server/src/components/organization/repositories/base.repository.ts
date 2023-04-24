import { BaseRepository } from "../../../common/abstracts/base.repository";
import { OrganizationClass } from "../../../database/models/organization.model";
import { OrganizationEntity } from "../entities/organization.entity";
import { organizationMapper } from "../entities/organization.mapper";
import { IOrganizationRepository } from "./interface.repository";
import { Inject, Injectable } from "@nestjs/common";
import { CityClass } from "src/database/models/city.model";
import { Model } from "mongoose";
import { RecvisitesEntity } from "../entities/recvisites.entity";
import { RecvisitesClass } from "src/database/models/recvisites.model";
import { PaymentInfoEntity } from "../entities/payments.entity";
import { PaymentServiceDataClass } from "src/database/models/payment.model";
import { OrganizationStatusClass } from "src/database/models/organizationStatus.model";

@Injectable()
export class OrganizationRepository
    extends BaseRepository<Array<OrganizationClass>, Array<OrganizationEntity>>
    implements IOrganizationRepository
{
    constructor(
        @Inject("Organization")
        private readonly OrganizationModel: Model<OrganizationClass>,

        @Inject("Recvisites")
        private readonly RecvisitesModel: Model<RecvisitesClass>,

        @Inject("PaymentServiceData")
        private readonly PaymentServiceDataModel: Model<PaymentServiceDataClass>,

				@Inject("organizationstatus")
        private readonly OrganizationstatusModel: Model<OrganizationStatusClass>
    ) {
        super(OrganizationModel, organizationMapper, "city", "city");
    }

    public async getOneByGUID(id: UniqueId): Promise<OrganizationEntity> {
        const organizationDoc = await this.OrganizationModel.findOne({ id }).populate("city");
        const organizationEntity = new OrganizationEntity(
            organizationDoc._id,
            organizationDoc.address.street,
            (organizationDoc.city as CityClass)?.name,
            [
                organizationDoc.address.latitude,
                organizationDoc.address.longitude
            ],
            organizationDoc.phone,
            organizationDoc.workTime,
            organizationDoc.id,
            organizationDoc.delivMetod,
						organizationDoc.isHidden,
						organizationDoc.reservetable,
						organizationDoc.city as string,
						organizationDoc.redirect,
						organizationDoc.redirectON
        );
        return organizationEntity;
    }

    async getRecvisites(organizationId: UniqueId): Promise<RecvisitesEntity> {
        const recvisitesDoc = await this.RecvisitesModel.findOne({
            organization: organizationId
        }).lean();

        return new RecvisitesEntity(
            recvisitesDoc?.postcode,
            recvisitesDoc?.address,
            recvisitesDoc?.ogrn,
            recvisitesDoc?.inn,
            recvisitesDoc?.name
        );
    }
    public async getOne(id: UniqueId) {
        const organizationDoc = await this.OrganizationModel.findById(
            id
        ).lean();

        return new OrganizationEntity(
            organizationDoc._id,
            organizationDoc.address.street,
            (organizationDoc.city as CityClass)?.name,
            [
                organizationDoc.address.latitude,
                organizationDoc.address.longitude
            ],
            organizationDoc.phone,
            organizationDoc.workTime,
            organizationDoc.id,
            organizationDoc.delivMetod,
						organizationDoc.isHidden,
						organizationDoc.reservetable,
						organizationDoc.city as string,
						organizationDoc.redirect,
						organizationDoc.redirectON
        );
    }

    public async getPaymentsInfo(organizationId: UniqueId,type = 'ip') {
        const paymentDoc = await this.PaymentServiceDataModel.findOne({
						organization: organizationId,
						typemagaz:type
        });
				

        return paymentDoc
    }
		public async getOrgStatus(organization:string){
			const result = await this.OrganizationstatusModel.findOne({organization})
			return result
		}
		public async getOrgStatusAll(organization:string){
			const result = await this.OrganizationstatusModel.find({organization})
			return result
		}
}
