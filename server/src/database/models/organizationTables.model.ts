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


@ModelOptions({
	options: { customName: "organizationtables", automaticName: false },
	schemaOptions: { versionKey: false }
})
export class OrganizationTablesClass {

	@prop()
	public organization!: string;

	@prop()
	public idsection!: string;

	@prop()
	name!:string

	@prop({ type: () => Array })
	tables!:any[]

}

export const OrganizationTablesSchema = buildSchema(OrganizationTablesClass);
export const OrganizationTablesModel = getModelForClass(
	OrganizationTablesClass
);
