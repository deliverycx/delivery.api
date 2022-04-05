import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    prop,
    Ref,
    Severity
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { CategoryClass } from "./category.model";
import { OrganizationClass } from "./organization.model";
import { Decimal128 } from "bson";

enum MeasureUnit {
    PIECE = "шт",
    PORTION = "порц"
}

@ModelOptions({
    options: { customName: "Product", allowMixed: Severity.ALLOW },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class ProductClass {
    @prop({ ref: () => OrganizationClass })
    public organization!: Ref<OrganizationClass>;

    @prop({ type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop()
    public id!: UniqueId;

    @prop()
    public name!: string;

    @prop()
    public description!: string;

    @prop()
    public additionalInfo!: string;

    @prop()
    public price!: number;

    @prop()
    public tags: string[];

    @prop()
    public weight!: number;

    @prop({ ref: "Category" })
    public category!: Ref<CategoryClass>;

    @prop()
    public image!: ImagePath;

    @prop()
    public measureUnit!: "шт" | "порц";

    @prop()
    public isFav!: boolean;
}

export const ProductSchema = buildSchema(ProductClass);
export const ProductModel = getModelForClass(ProductClass);
