import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";

export class GetAllCartDTO {
		@ApiProperty()
		organization: UniqueId;
    @ApiProperty({
        enum: ["COURIER", "PICKUP"]
    })
    @IsOptional()
    public orderType: OrderTypesEnum = OrderTypesEnum.COURIER;
		userid:string
}
