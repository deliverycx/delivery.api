import {
    buildSchema,
    getModelForClass,
    ModelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { OrganizationClass } from "./organization.model";

@ModelOptions({
    options: { customName: "Category" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class CategoryClass {
    @prop({ type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop()
    public id!: UniqueId;

    @prop()
    public name!: string;

    @prop()
    public image!: ImagePath;

    @prop()
    public order!: number;

    @prop({ ref: () => OrganizationClass })
    public organization!: Ref<OrganizationClass>;
}

export const CategorySchema = buildSchema(CategoryClass);
export const CategoryModel = getModelForClass(CategoryClass);
