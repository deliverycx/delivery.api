import { ApiProperty } from "@nestjs/swagger";
import { IsCardCvv } from "src/common/decorators/cardCvv.decorator";
import { IsCardExpires } from "src/common/decorators/cardExpires.decorator";
import { IsCardNumber } from "src/common/decorators/cardNumber.decorator";

export class AddCardDTO {
    @ApiProperty({
        example: "2200 0000 0000 0000",
        examples: [
            "2200 0000 0000 0000",
            "4111 1111 1111 1111",
            "2200000000000000",
            "4111111111111111"
        ]
    })
    @IsCardNumber("", { message: "Не верный формат карты" })
    number: string;

    @ApiProperty({ example: 777 })
    @IsCardCvv("", { message: "Не правильный cvv/csv код" })
    cvv: number;

    @ApiProperty({
        properties: {
            year: { type: "number", example: 29 },
            month: { type: "number", example: 12 }
        }
    })
    @IsCardExpires("", { message: "Не верно указана дата" })
    expires: ExpiresType;

    @ApiProperty({
        example: "VIKTOR VIKTOROVICH",
        default: "UNKNOWN"
    })
    cardholder?: string;
}
