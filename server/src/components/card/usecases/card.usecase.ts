import { Injectable } from "@nestjs/common";
import { AddCardDTO } from "../dto/addCard.dto";
import { ICardRepository } from "../repositories/interface.repository";

@Injectable()
export class CardUsecase {
    constructor(private readonly cardRepository: ICardRepository) {}

    public async addCard(userId: UniqueId, card: AddCardDTO) {
        const result = await this.cardRepository.addCard(userId, {
            ...card,
            number: card.number.replace(/\s/g, "")
        });

        return result.prepareForClient();
    }

    public async deleteCard(userId, cardId: UniqueId) {
        const result = await this.cardRepository.deleteCard(userId, cardId);

        return result;
    }

    public async getAll(userId: UniqueId) {
        const result = await this.cardRepository.getAll(userId);

        return result.map((card) => card.prepareForClient());
    }


}
