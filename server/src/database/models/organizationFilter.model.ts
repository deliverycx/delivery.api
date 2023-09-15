import {
	buildSchema,
	getModelForClass,
	modelOptions,
	ModelOptions,
	mongoose,
	prop,
	Ref,
	Severity
} from "@typegoose/typegoose";


@modelOptions({ 
	options: { customName: "Organizationfilter", allowMixed: Severity.ALLOW },
	schemaOptions: { collection: 'organizationfilter' } })
export class OrganizationfilterClass {

	@prop()
	public name!: string;

	@prop()
	public images!: [];
	

}

export const OrganizationfilterSchema = buildSchema(OrganizationfilterClass);
export const OrganizationfilterModel = getModelForClass(
	OrganizationfilterClass
);