import { CardClass } from "src/database/models/card.model";
import { Mapper } from "../../../common/abstracts/mapper.interface";
import { CardEntity } from "./card.entity";

export const cardMapper: Mapper<Array<CardClass>, Array<CardEntity>> = (p) => {
    return p.map((card) => {
        return new CardEntity(
            card._id,
            card.expires.month,
            card.expires.year,
            card.number,
            card.cardholder
        );
    });
};
