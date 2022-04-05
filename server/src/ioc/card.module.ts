import { Module } from "@nestjs/common";
import { CardController } from "src/components/card/controllers/card.controller";
import { cardProviders } from "src/components/card/providers/card.provider";
import { CardRepository } from "src/components/card/repositories/base.repository";
import { ICardRepository } from "src/components/card/repositories/interface.repository";
import { CardUsecase } from "src/components/card/usecases/card.usecase";

@Module({
    controllers: [CardController],
    providers: [
        CardUsecase,
        {
            provide: ICardRepository,
            useClass: CardRepository
        },
        ...cardProviders
    ]
})
export class CardModule {}
