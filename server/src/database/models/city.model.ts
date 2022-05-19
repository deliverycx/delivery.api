import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    mongoose,
    prop,
    Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";

@ModelOptions({
    options: { customName: "City" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class CityClass {
    @prop({ type: mongoose.Types.ObjectId })
    public _id!: UniqueId;

    @prop()
    public name!: string;

    @prop({ ref: "Organization" })
    public organizations!: Ref<OrganizationClass>[];

		@prop({ default: false })
    public isHidden:boolean
}

export const CitySchema = buildSchema(CityClass);
export const CityModel = getModelForClass(CityClass);
