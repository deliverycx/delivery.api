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
        customName: "Recvisites"
    },
    schemaOptions: {
        timestamps: true,
        versionKey: false
    }
})
export class RecvisitesClass {
    @prop()
    name: string;

    @prop()
    inn: string;

    @prop()
    address: string;

    @prop()
    ogrn: string;

    @prop()
    postcode: string;

    @prop()
    organization: string;
}

export const recvisitesModel = getModelForClass(RecvisitesClass);
export const recvisitesSchema = buildSchema(RecvisitesClass);
