import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { BaseRepository } from "src/common/abstracts/base.repository";
import { CardClass } from "src/database/models/card.model";
import { TestModelClass } from "src/database/models/test.model";
import { AddCardDTO } from "../dto/addCard.dto";
import { CardEntity } from "../entities/card.entity";
import { cardMapper } from "../entities/card.mapper";
import { ICardRepository } from "./interface.repository";

@Injectable()
export class CardRepository
    extends BaseRepository<Array<CardClass>, Array<CardEntity>>
    implements ICardRepository
{
    constructor(
        @Inject("Card")
        private readonly CardModel: Model<CardClass>,
				@Inject("Test")
        private readonly TestModel: Model<TestModelClass>
    ) {
        super(CardModel, cardMapper, "user");
    }

    async deleteCard(userId: UniqueId, cardId: UniqueId): Promise<UniqueId> {
        const result = await this.CardModel.findByIdAndDelete(cardId);

        return cardId;
    }
    async addCard(userId: UniqueId, card: AddCardDTO): Promise<CardEntity> {
        const doc = await this.CardModel.findOneAndUpdate(
            { user: userId, number: card.number },
            {
                $setOnInsert: {
                    user: userId,
                    number: card.number,
                    cvv: card.cvv,
                    expires: card.expires,
                    cardholder: card.cardholder
                }
            },
            { new: true, upsert: true }
        );

        const result = new CardEntity(
            doc._id,
            doc.expires.month,
            doc.expires.year,
            doc.number,
            doc.cardholder
        );

        return result;
    }
		async addtest(){
			return await this.TestModel.create({name:'vasa'})
		}
}
