import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsObject, IsOptional, IsEmail } from "class-validator";
import { IsCardCvv } from "src/common/decorators/cardCvv.decorator";
import { IsCardExpires } from "src/common/decorators/cardExpires.decorator";
import { IsCardNumber } from "src/common/decorators/cardNumber.decorator";
import { prepareYear } from "src/common/decorators/expiresYear.decorator";
import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";
import { PaymentMethods } from "../../../services/payment/payment.abstract";

export class OrderDTO {
    @ApiProperty()
    organization: string;

    @ApiProperty()
    name: string;

    @ApiProperty({
        properties: {
            city: { type: "string", example: "Симферополь" },
            street: { type: "string", example: "Турецкая" },
            home: { type: "number", minimum: 1, example: 15 },
            flat: { type: "number" },
            intercom: { type: "number" },
            entrance: { type: "number" },
            floor: { type: "number" }
        }
    })
    @ApiProperty()  
    date:string
    
    @IsObject()
		@IsOptional()
    address: {
        city: string;
        street: string;
        home: number;
        flat: number;
        intercom: number;
        entrance: number;
        floor: number;
				kladrid:string
				cordAdress?:number[]
    };

    @ApiProperty({
        enum: ["COURIER", "PICKUP","ONSPOT"]
    })
    orderType: OrderTypesEnum;

		orderTable:{
			section: string
			id: string
			numb: number
		}
		userid:string
    @ApiProperty()
    @IsPhoneNumber("RU", {
        message: () => {
            throw new BadRequestException("Не верный формат телефона");
        }
    })
    phone: string;

		terminal:string

    @ApiProperty()
    comment: string;
		localhost:string

    @ApiProperty({
        enum: PaymentMethods
    })
    paymentMethod: PaymentMethods;

		@ApiProperty()
		hash:string

    @ApiProperty({ required: false })
    @IsEmail({ message: "Не корректный e-mail" })
    @IsOptional()
    email?: string;
		paymentsum:number
		organizationid:string
		
}
