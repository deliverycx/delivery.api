import { Injectable } from "@nestjs/common";
import { CartEntity } from "src/components/cart/entities/cart.entity";
import { ValidationCountError } from "../../errors/order.error";
import { schema, ISchema } from "./validation.schema";

@Injectable()
export class ValidationCount {
    private readonly schema: ISchema;

    constructor() {
        this.schema = schema;
    }

    validate(cart: Array<CartEntity>) {
        let filteredCart = {};

        Object.keys(this.schema).forEach((key) => {
            const regex = new RegExp(key + "-\\d+", "i");

            cart.forEach((cartEl) => {
                const tagIndex = cartEl.getProductTags
                    ? cartEl.getProductTags.findIndex((el) => el.match(regex))
                    : -1;

                if (tagIndex !== -1) {
                    const key =
                        cartEl.getProductTags[tagIndex].match(/[a-z]+/i)[0];

                    filteredCart = {
                        ...filteredCart,
                        [key.toUpperCase()]:
                            key in filteredCart
                                ? filteredCart[key] + cartEl.getAmount
                                : cartEl.getAmount
                    };
                }
            });
        });

        let errors = {};

        Object.keys(filteredCart).forEach((el) => {
            if (filteredCart[el] < this.schema[el].min) {
                errors[el] = {
                    message: `Заказ на доставку от ${this.schema[el].min} шт. Пожалуйста добавьте еще.`
                };
            }
        });

        return errors;
    }
}
