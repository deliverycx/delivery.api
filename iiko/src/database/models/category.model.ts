import {
    getModelForClass,
    ModelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { OrganizationClass } from "./organization.model";

@ModelOptions({
    options: { customName: "Category" },
    schemaOptions: { versionKey: false, timestamps: true }
})
export class CategoryClass {
    @prop({ required: false })
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

export const CategoryModel = getModelForClass(CategoryClass);
