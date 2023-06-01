import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { ProductClass } from "./product.model";
import { UserClass } from "./user.model";

@ModelOptions({
    options: { customName: "Favorite" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class FavoriteClass {
    @prop({ ref: "User" })
    user!: Ref<UserClass>;

    @prop()
    products:[];
}

export const FavoriteSchema = buildSchema(FavoriteClass);
export const FavoriteModel = getModelForClass(FavoriteClass);
