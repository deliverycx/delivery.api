import {
	buildSchema,
	getModelForClass,
	ModelOptions,
	mongoose,
	prop,
	Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";
import { UserClass } from "./user.model";

@ModelOptions({
	options: { customName: "Profile" },
	schemaOptions: { versionKey: false, timestamps: true }
})

export class ProfileClass{

	@prop({ ref: () => UserClass })
	public userid!: Ref<UserClass>;

	@prop()
  public personal!: any;

	@prop()
  public adressdelivery!: any;
}

export const ProfileSchema = buildSchema(ProfileClass);
export const ProfileModel = getModelForClass(ProfileClass);