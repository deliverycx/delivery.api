import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";

export class RemoveOneDTO {
    @ApiProperty()
    @IsMongoIdObject()
    public cartId: UniqueId;

    @ApiProperty({
        enum: ["COURIER", "PICKUP"]
    })
    public orderType: OrderTypesEnum;
}
