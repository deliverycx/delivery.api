import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    Res,
    Session,
    UseFilters,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { AuthGuard } from "src/guards/authorize.guard";
import { AddCartDTO } from "../dto/add.dto";
import { ChangeAmountDTO } from "../dto/changeAmount.dto";
import { RemoveOneDTO } from "../dto/removeOne.dto";
import { CartUsecase } from "../usecases/cart.usecase";
import { ApiBody, ApiTags, ApiResponse, ApiCookieAuth } from "@nestjs/swagger";
import { CartEntity } from "../entities/cart.entity";
import { UnauthorizedFilter } from "src/filters/unauthorized.filter";
import { ValidationException } from "src/filters/validation.filter";
import { Response } from "express";
import { GetAllCartDTO } from "../dto/getAll.dto";
import { DiscountDTO } from "../dto/discount.dto";
import { JwtAuthGuard } from "src/guards/jwt.guard";

@ApiTags("Cart endpoints")
@ApiResponse({
    status: 401,
    description: "в случае если пользователь без сессионных кук"
})
@ApiCookieAuth()
@Controller("cart")
@UseFilters(new ValidationException())
@UsePipes(
    new ValidationPipe({
        transform: true
    })
)
//@UseFilters(new UnauthorizedFilter())
//@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartUsecase: CartUsecase) {}

    @ApiBody({
        type: AddCartDTO
    })
    @ApiResponse({
        status: 200,
        schema: {
            properties: {
                item: { type: "object", example: CartEntity },
                totalPrice: { type: "number", example: 1200 },
                deliveryPrice: { type: "number", example: 0 },
                deltaPrice: {
                    type: "number",
                    example: 0,
                    description:
                        "Отображает разницу между 600 и общей суммой товарров"
                }
            }
        }
    })
    @Post("add")
    async add(
        @Body()
        addBody: AddCartDTO,
        @Session()
        session: Record<string, string>,
        @Res() response: Response
    ) {

        const result = await this.cartUsecase.add(addBody.userid, addBody);
        response.status(200).json(result);
    }

    @ApiBody({
        type: RemoveOneDTO
    })
    @ApiResponse({
        status: 200,
        schema: {
            properties: {
                deletedId: {
                    type: "string",
                    example: "61b609abaabff8e544dfecee"
                },
                totalPrice: { type: "number", example: 1200 },
                deliveryPrice: { type: "number", example: 0 },
                deltaPrice: {
                    type: "number",
                    example: 0,
                    description:
                        "Отображает разницу между 600 и общей суммой товарров"
                }
            }
        },
        description: "Возращает ID удаленного итема"
    })
    @Delete("removeOne")
    async removeOne(
        @Body()
        removeBody: RemoveOneDTO,
        @Session()
        session: Record<string, string>,
        @Res() response: Response
    ) {
        const result = await this.cartUsecase.removeOne(
						removeBody.userid,
            removeBody
        );

        response.status(200).json(result);
    }

    @ApiResponse({
        status: 200,
        description: "Возращает [] в случае успеха",
        type: Array
    })
    @Delete("deleteAll")
    async deleteAll(
        @Session()
        session: Record<string, string>,
        @Res() response: Response,
				@Body()
        Body: {userid:string},
    ) {
        const result = await this.cartUsecase.removeAll(Body.userid);

        response.status(200).json(result);
    }

    @ApiBody({
        type: ChangeAmountDTO
    })
    @ApiResponse({
        status: 200,
        schema: {
            properties: {
                item: { type: "object", example: CartEntity },
                totalPrice: { type: "number", example: 1200 },
                deliveryPrice: { type: "number", example: 0 },
                deltaPrice: {
                    type: "number",
                    example: 0,
                    description:
                        "Отображает разницу между 600 и общей суммой товарров"
                }
            }
        }
    })
    @Post("amount")
    async changeAmount(
        @Body()
        changeAmountBody: ChangeAmountDTO,
        @Session()
        session: Record<string, string>,
        @Res() response: Response
    ) {
        const result = await this.cartUsecase.changeAmount(
						changeAmountBody.userid,
            changeAmountBody
        );

        response.status(200).json(result);
    }

    @Get("getAll")
    @ApiBody({
        type: GetAllCartDTO
    })
    @ApiResponse({
        schema: {
            properties: {
                cart: { type: "array", example: [] },
                totalPrice: { type: "number", example: 1200 },
                deliveryPrice: { type: "number", example: 0 },
                deltaPrice: {
                    type: "number",
                    example: 0,
                    description:
                        "Отображает разницу между 600 и общей суммой товарров"
                }
            }
        },
        status: 200
    })
    async getAll(
        @Session()
        session: Record<string, string>,
        @Res() response: Response,
        @Query() query: GetAllCartDTO
    ) {

				if(!session.user){
					session.user = query.userid
				}
        const result = await this.cartUsecase.getAll(query.userid, query);

        response.status(200).json(result);
    }

		@Post("getDiscount")
		async getDiscount(
					@Body()
					body: DiscountDTO,
					@Session()
					session: Record<string, string>,
					@Res() response: Response
		) {
				const result = await this.cartUsecase.getDiscount(session.user,body);

				response.status(200).json(result);
		}

		@Post("getDeliveryZone")
		async deliveryZone(
					@Body()
					body: {organizationIds:string},
					@Session()
					session: Record<string, string>,
					@Res() response: Response
		) {

				
				const result = await this.cartUsecase.getDeliveryZones(body)

				response.status(200).json(result);
		}

		@Get("organizationtables")
		async tables(
			@Query() query: {id:string}
		) {
			const result = await this.cartUsecase.getOrganiztionTable(query.id)
			return 	result
		}

}
