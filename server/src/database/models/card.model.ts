import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    mongoose,
    prop,
    Ref,
    Severity
} from "@typegoose/typegoose";
import { ProductClass } from "./product.model";
import { UserClass } from "./user.model";

@ModelOptions({
    options: { customName: "Card", allowMixed: Severity.ALLOW },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class CardClass {
    @prop({ type: mongoose.Types.ObjectId })
    public _id!: UniqueId;

    @prop({ ref: "User" })
    public user!: Ref<UserClass>;

    @prop({ type: () => String })
    public number: string;

    @prop({ type: () => Number })
    public cvv: string;

    @prop({ type: () => Object })
    public expires: {
        year: string;
        month: string;
    };

    @prop({ type: () => String, default: "UNKNOWN" })
    public cardholder: string;
}

export const CardSchema = buildSchema(CardClass);
export const CardModel = getModelForClass(CardClass);
