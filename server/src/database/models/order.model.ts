import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { warnMixed } from "@typegoose/typegoose/lib/internal/utils";
import { Types } from "mongoose";
import { UserClass } from "./user.model";

class NestedOrderClass {
    @prop({ type: Number })
    price!: number;
    @prop({ type: String })
    orderNum!: string;
}

@ModelOptions({
    options: { customName: "Order" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class OrderClass {
    @prop({ ref: "User", type: Types.ObjectId })
    user!: Ref<UserClass>;

    @prop({ required: true, default: [], type: NestedOrderClass })
    orders!: [NestedOrderClass];
}

export const OrderSchema = buildSchema(OrderClass);

export const OrderModel = getModelForClass(OrderClass);
