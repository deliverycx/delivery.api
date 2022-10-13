import {
	getModelForClass,
	ModelOptions,
	prop,
	buildSchema,
	Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";

@ModelOptions({
	options: {
			customName: "Test"
	},
	schemaOptions: {
			timestamps: true,
			versionKey: false
	}
})
export class TestModelClass {
	@prop()
	name: string;
}

export const testModel = getModelForClass(TestModelClass);
export const testSchema = buildSchema(TestModelClass);
