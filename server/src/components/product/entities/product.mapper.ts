import { ProductClass } from "../../../database/models/product.model";
import { Mapper } from "../../../common/abstracts/mapper.interface";
import { ProductEntity } from "./product.entity";
import { CategoryClass } from "../../../database/models/category.model";

export const productMapper: Mapper<
    Array<ProductClass & { isFav: boolean }>,
    Array<ProductEntity>
> = (p) => {
    return p.map((product) => {
        return new ProductEntity(
            product._id,
            product.name,
						product.id,
            product.description,
            product.additionalInfo,
            product.price,
            product.weight,
            product.measureUnit,
            product.image,
            (product.category as CategoryClass)?.image,
            product.isFav
        );
    });
};
