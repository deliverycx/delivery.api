import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { CartClass } from "./cart.model";

class Address {
    @prop({ type: String })
    public street: string;
    @prop({ type: Number })
    public home: number;

    constructor(street: string, home: number) {
        this.street = street;
        this.home = home;
    }
}

@ModelOptions({
    options: { customName: "User" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class UserClass {
    @prop()
    public name!: string;

    @prop({ unique: true })
    public username!: string;

    @prop()
    public phone!: string;

    @prop({ type: Types.ObjectId })
    public selectedOrganization: Types.ObjectId;

    @prop({ type: Address })
    public address!: Address;

    @prop({ ref: () => CartClass })
    public cart!: Ref<CartClass>;
}

export const UserSchema = buildSchema(UserClass);
export const UserModel = getModelForClass(UserClass);
