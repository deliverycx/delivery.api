import {
    getModelForClass,
    ModelOptions,
    mongoose,
    prop,
    Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";
import { Types } from "mongoose";

@ModelOptions({
    options: { customName: "City" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class CityClass {
    @prop({ type: mongoose.Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop()
    public name!: string;

    @prop({ ref: "Organization" })
    public organizations!: Ref<OrganizationClass>[];
}

export const CityModel = getModelForClass(CityClass);
