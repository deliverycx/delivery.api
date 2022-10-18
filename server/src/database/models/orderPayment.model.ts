import {
	buildSchema,
	getModelForClass,
	ModelOptions,
	prop,
	Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";

@ModelOptions({
	options: { customName: "Paymentorder", automaticName: false },
	schemaOptions: { versionKey: false }
})
export class OrderPaymentClass {
	@prop({ type: () => String })
  public idorganization: string

	@prop({ type: () => Number })
	public paymentid:number

	@prop({ type: () => String })
	public merchantId:string

	@prop({ type: () => String })
	public paymentStatus:string

	@prop({ type: () => Number })
	public paymentAmount:number

	@prop({ type: () => String })
	public paymentTime:string

	@prop({ type: () => Object })
	public paymentparams:any

	@prop({ type: () => Object })
	public paymentData:any

	@prop({ type: () => String })
	public orderId:string

	@prop({ type: () => String })
	public orderStatus:string

	@prop({ type: () => Number })
	public orderAmount:number

	@prop({ type: () => Object })
	public orderItems:any
}

export const OrderPaymentSchema = buildSchema(OrderPaymentClass);
export const OrderPaymentModel = getModelForClass(
	OrderPaymentClass
);