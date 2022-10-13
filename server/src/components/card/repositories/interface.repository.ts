import { AddCardDTO } from "../dto/addCard.dto";
import { CardEntity } from "../entities/card.entity";

export abstract class ICardRepository {
    abstract addCard(userId: UniqueId, card: AddCardDTO): Promise<CardEntity>;
    abstract deleteCard(userId: UniqueId, cardId: UniqueId): Promise<UniqueId>;
    abstract getAll(userId: UniqueId): Promise<Array<CardEntity>>;
}
