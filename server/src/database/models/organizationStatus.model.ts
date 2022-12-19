import {
	buildSchema,
	getModelForClass,
	ModelOptions,
	mongoose,
	prop,
	Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";
import { Types } from "mongoose";
import { ORG_STATUS, PAYMENT_METODS } from "src/common/constants/const.orgstatus";


@ModelOptions({
	options: { customName: "organizationstatus", automaticName: false },
	schemaOptions: { versionKey: false,collection:"organizationstatus" }
})
export class OrganizationStatusClass {

	@prop()
	public organization!: string;

	@prop({ type: () => Array, default: null })
	public deliveryMetod!: string[] | null;

	@prop({default:ORG_STATUS.NOWORK})
	organizationStatus!:string

	@prop({ type: () => Array, default: [PAYMENT_METODS.CASH,PAYMENT_METODS.BYCARD] })
	public paymentMetod!: string[] | null;

}

export const OrganizationStatusSchema = buildSchema(OrganizationStatusClass);
export const OrganizationStatusModel = getModelForClass(
	OrganizationStatusClass
);
