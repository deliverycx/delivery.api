import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";
import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";

export class ChangeAmountDTO {
		@ApiProperty()
		organization: UniqueId;

    @ApiProperty()
    @IsNumber()
    public amount: number;

    @ApiProperty()
    @IsMongoIdObject()
    public cartId: UniqueId;

    @ApiProperty({
        enum: ["COURIER", "PICKUP"]
    })
    public orderType: OrderTypesEnum;
}
