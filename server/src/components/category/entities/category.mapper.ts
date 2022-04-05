import { Mapper } from "../../../common/abstracts/mapper.interface";
import { CategoryClass } from "../../../database/models/category.model";
import { CategoryEntity } from "./category.entity";

export const categoryMapper: Mapper<
    Array<CategoryClass>,
    Array<CategoryEntity>
> = (p) => {
    return p.map((category) => {
        return new CategoryEntity(category._id, category.name, category.image);
    });
};
