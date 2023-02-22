import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";

@ModelOptions({
    options: { customName: "PaymentInfo", automaticName: false },
    schemaOptions: { versionKey: false }
})
export class PaymentServiceDataClass {
    @prop()
    public isActive!: boolean;

    @prop()
    public token!: string;

    @prop()
    public merchantId!: string;

    @prop()
    public organization: string;

		@prop()
    public typemagaz!: string;
}

export const PaymentServiceDataSchema = buildSchema(PaymentServiceDataClass);
export const PaymentServiceDataModel = getModelForClass(
    PaymentServiceDataClass
);
