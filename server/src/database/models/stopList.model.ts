import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";

class NestedStopListClass {
    @prop({ type: String })
    public product: UniqueId;
    @prop({ type: Number })
    public balance: number;

    constructor(product: UniqueId, balance: number) {
        this.product = product;
        this.balance = balance;
    }
}

@ModelOptions({
    options: { customName: "StopList" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class StopListClass {
    @prop()
    organization: string;

    @prop()
    stoplist: any[];
}

export const StopListSchema = buildSchema(StopListClass);
export const StopListModel = getModelForClass(StopListClass);
