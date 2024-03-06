import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    mongoose,
    prop,
    Ref
} from "@typegoose/typegoose";
import { ProductClass } from "./product.model";
import { UserClass } from "./user.model";

@ModelOptions({
    options: { customName: "Cart" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class CartClass {
    @prop({ type: mongoose.Types.ObjectId })
    public _id!: UniqueId;

    @prop({ ref: "User" })
    public user!: Ref<UserClass>;

    @prop()
    public product!: any;

    @prop({
        type: () => Number,
        validate: {
            validator: (v: number) => {
                return v > 1;
            },
            message: "Некорректное значение"
        }
    })
    public amount: number = 1;
}

export const CartSchema = buildSchema(CartClass);
export const CartModel = getModelForClass(CartClass);
