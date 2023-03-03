import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    prop,
    Ref,
    Severity
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { CityClass } from "./city.model";

@ModelOptions({
    options: { customName: "Organization", allowMixed: Severity.ALLOW },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class OrganizationClass {
    @prop({ type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop()
    public id!: UniqueId;

    @prop({ ref: "City" })
    public city!: Ref<CityClass>;

    @prop({ type: () => Object })
    public address!: {
        street: string;
        latitude: number;
        longitude: number;
    };

    @prop()
    public phone!: string;

    @prop({ type: () => Number })
    public revision!: number;

    @prop()
    public workTime!: string[] | string;
    
    @prop({ default: null })
    public delivMetod:string | null
    
    @prop({ default: true })
    public isHidden:boolean

		@prop()
    public redirect:string

		@prop({ default: false })
    public reservetable:boolean

}

export const OrganizationSchema = buildSchema(OrganizationClass);
export const OrganizationModel = getModelForClass(OrganizationClass);
