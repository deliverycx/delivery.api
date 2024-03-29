import { DocumentType } from "@typegoose/typegoose";
import { CartClass } from "../../../database/models/cart.model";
import { Mapper } from "../../../common/abstracts/mapper.interface";
import { CartEntity } from "./cart.entity";
import { ProductClass } from "../../../database/models/product.model";

export const cartMapper: Mapper<Array<CartClass>, Array<CartEntity>> = (p) => {
    return p
        .map((cart) => {
            const product = cart.product as ProductClass;
						
						if(product){
            return new CartEntity(
                cart?._id,
                product?.name,
                product?.image,
                product?.tags,
                product?.productId,
                cart?.amount,
                product?.price,
								product._id
            );
						}
        })
        .filter((entity) => {
					return entity && entity.getId !== undefined
				});
};
export const cartMapperCust= (p:any[]) => {
	return p
			.map((cart) => {
					const product = cart.product as ProductClass;
					return {
						id:product?.id,
            name:product?.name,
            amount:cart?.amount,
            sum:  cart?.amount * product?.price,
						tags:product?.tags,
						price:product?.price,
            code:product?.code,
					}
			})
			
};