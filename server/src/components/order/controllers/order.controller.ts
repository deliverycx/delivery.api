import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Res,
    Session,
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/guards/authorize.guard";
import { ApiTags, ApiResponse, ApiCookieAuth } from "@nestjs/swagger";
import { OrderUsecase } from "../usecases/order.usecase";
import { OrderDTO } from "../dto/order.dto";
import { ValidationException } from "src/filters/validation.filter";
import { OrderEntity } from "../entities/order.entity";
import { BaseError } from "src/common/errors/base.error";
import { UnauthorizedFilter } from "src/filters/unauthorized.filter";
import { PaymentService } from "../../../services/payment/payment.service";
import { PaymentException } from "src/filters/payment.filter";
import { RedirectEntity } from "../entities/redirect.entity";

@ApiTags("Order endpoints")
@ApiResponse({
    status: 401,
    description: "в случае если пользователь без сессионных кук"
})
@ApiCookieAuth()
@Controller("order")
@UseFilters(new ValidationException())
@UseFilters(new PaymentException())
@UsePipes(
    new ValidationPipe({
        transform: true
    })
)
@UseFilters(new UnauthorizedFilter())
@UseGuards(AuthGuard)
export class OrderController {
    constructor(
        private readonly OrderUsecase: OrderUsecase,
        private readonly PaymentService: PaymentService
    ) {}

    @ApiResponse({
        status: 200,
        type: RedirectEntity,
        description: "Возращает урл для редиректа"
    })
    @Post("create")
    async create(
        @Body() body: OrderDTO,
        @Session() session: Record<string, string>,
        @Res() response: Response
    ) {
        const paymentResult = await this.PaymentService.route(
            body,
            session.user
        );

        response.status(200).json(paymentResult);
    }

    @ApiResponse({
        status: 200,
        type: "OK",
        description: "Возращает ОК в случае если доставка осуществляется"
    })
    @ApiResponse({
        status: 400,
        type: BaseError,
        description:
            "В случае, если пользователь пытается сделать заказ с пустой корзиной"
    })
    @Post("check")
    async checkOrder(
        @Body() body: OrderDTO,
        @Session() session: Record<string, string>,
        @Res() response: Response
    ) {
        await this.OrderUsecase.checkOrder(session.user, body);

        response.status(200).json({ message: "Order can be send" });
    }

    @ApiResponse({
        status: 200,
        type: OrderEntity,
        description: "Возращает номер заказа"
    })
    @Get("number/:hash")
    async getOrderNumber(
        @Res() response: Response,
        @Param("hash") hash: string
    ) {
        const result = await this.OrderUsecase.getOrderNumber(hash);

        response.status(200).json(result);
    }
}
