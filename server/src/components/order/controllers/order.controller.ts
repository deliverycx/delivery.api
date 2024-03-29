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
import { OrderCheckDto } from "../dto/orderCheck.dto";
import { OrderService } from "../services/order/order.service";
import axios from "axios";
import { JwtAuthGuard } from "src/guards/jwt.guard";


@ApiTags("Order endpoints")
@ApiResponse({
    status: 401,
    description: "в случае если пользователь без сессионных кук"
})

@Controller("order")
@UseFilters(new ValidationException())
@UseFilters(new PaymentException())
@UsePipes(
    new ValidationPipe({
        transform: true
    })
)
@UseFilters(new UnauthorizedFilter())
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(
        private readonly OrderUsecase: OrderUsecase,
        private readonly PaymentService: PaymentService,
				private readonly orderService: OrderService
    ) {}

    @ApiResponse({
        status: 200,
        type: RedirectEntity,
        description: "Возращает урл для редиректа"
    })
    @Post("createPaymentOrder")
    async create(
        @Body() body: OrderDTO,
        @Session() session: Record<string, string>,
        @Res() response: Response
    ) {
		
        const paymentResult = await this.PaymentService._byCard(
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
        @Body() body: OrderCheckDto,
        @Session() session: Record<string, string>,
       
    ) {

        const hash = await this.OrderUsecase.checkOrder(body.userid, body);

        return hash
    }



		@Post("checkcart")
    async checkOrderCart(
        @Session() session: Record<string, string>,
        @Body() body: {userid:string},
    ) {
				
        const result = await this.OrderUsecase.checkOrderCart(body.userid);
	
        return result
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
 
		@Post("createOrderMicro")
    async createOrderMicro(
        @Body() body: OrderDTO,
				@Session() session: Record<string, string>,
				@Res() response: Response,
    ) {
			try {
				await this.orderService.createOrderToRabbit(body.userid, body)
				response.status(200).json(true);
			} catch (error) {
				response.status(408).json(false);
			}
				
    }


		@Get("getorder/:hash")
    async getOrder(
				@Res() response: Response,
        @Param("hash") hash: string
    ) {
				
        const result = await this.orderService.getOrderHash(hash)
				response.status(200).json(result);
    }

		@Get("gethash/:hash")
    async getHash(
				@Res() response: Response,
        @Param("hash") hash: string
    ) {
				
        const result = await this.orderService.getOrderHash(hash)
				response.status(200).json(result);
    }

		@Get("orderuser/:user")
    async getOrderByUser(
				@Res() response: Response,
        @Param("user") user: string
    ) {
				
        const result = await this.orderService.getOrderUser(user)
				response.status(200).json(result);
    }

		@Post("smstable")
    async smstable(
			@Body() body: any,
			@Res() response: Response,
    ) {
			try {
				const {data} = await axios.get('https://cxcrimea@yandex.ru:zx4dUbwFtA319jZ3P90q7L2dyjtzD70M@gate.smsaero.ru/v2/auth')
				if(data && data.success){
					const urls = encodeURI(`https://cxcrimea@yandex.ru:zx4dUbwFtA319jZ3P90q7L2dyjtzD70M@gate.smsaero.ru/v2/sms/send?number=${body.phone}&text=${body.textsms}&sign=Khinkalich`)
					const smsresult = await axios.get(urls)
					console.log('sms',smsresult);
					response.status(200).json(smsresult);
				}
			} catch (error) {
				console.log(error);
				response.status(501).json(null);
			}
			
				
    }

}
