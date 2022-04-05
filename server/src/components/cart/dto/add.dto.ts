import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";

export class AddCartDTO {
    @ApiProperty({
        description: "Mongo id object"
    })
    @IsMongoIdObject()
    public productId: UniqueId;

    @ApiProperty({
        enum: ["COURIER", "PICKUP"]
    })
    public orderType: OrderTypesEnum;
}
