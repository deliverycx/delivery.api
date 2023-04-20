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

    @prop({ ref: "Organization" })
    public organization: Ref<OrganizationClass>;
}

export const PaymentServiceDataSchema = buildSchema(PaymentServiceDataClass);
export const PaymentServiceDataModel = getModelForClass(
    PaymentServiceDataClass
);
