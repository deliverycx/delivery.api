import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Res,
    Session,
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { UnauthorizedFilter } from "src/filters/unauthorized.filter";
import { ValidationException } from "src/filters/validation.filter";
import { AuthGuard } from "src/guards/authorize.guard";
import { AddCardDTO } from "../dto/addCard.dto";
import { DeleteCardDTO } from "../dto/deleteCard.dto";
import { CardUsecase } from "../usecases/card.usecase";

@Controller("card")
@ApiTags("Card endpoints")
@ApiResponse({
    status: 401,
    description: "в случае если пользователь без сессионных кук"
})
@UsePipes(
    new ValidationPipe({
        transform: true
    })
)
@UseFilters(new UnauthorizedFilter())
@UseFilters(new ValidationException())
@UseGuards(AuthGuard)
export class CardController {
    constructor(private readonly cardUsecase: CardUsecase) {}

    @Post("add")
    async addCard(
        @Body() body: AddCardDTO,
        @Res() response: Response,
        @Session() session: Record<string, string>
    ) {
        const result = await this.cardUsecase.addCard(session.user, body);

        response.status(200).json(result);
    }

    @Delete("delete")
    async deleteCard(
        @Body() body: DeleteCardDTO,
        @Res() response: Response,
        @Session() session: Record<string, string>
    ) {
        const result = await this.cardUsecase.deleteCard(
            session.user,
            body.cardId
        );

        response.status(200).json(result);
    }

    @Get("all")
    async getAll(
        @Res() response: Response,
        @Session() session: Record<string, string>
    ) {
        const result = await this.cardUsecase.getAll(session.user);

        response.status(200).json(result);
    }
}
