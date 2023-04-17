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

    @prop({ type: () => String })
	  public organization: string


		@prop({ type: () => String })
		public orderId:string

		@prop()
		public orderNumber:number

		@prop({ type: () => String })
		public orderHash:string

		@prop({ type: () => String })
		public orderStatus:string

		@prop({ type: () => Number })
		public orderAmount:number

		@prop({ type: () => Object })
		public orderItems:any

		@prop({ type: () => Object })
		public orderParams:any

		@prop({default: null })
		public orderError:any
}

export const OrderSchema = buildSchema(OrderClass);

export const OrderModel = getModelForClass(OrderClass);
