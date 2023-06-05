import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";

export class AddCartDTO {
		@ApiProperty()
		organization: string;

    @ApiProperty({
        description: "Mongo id object"
    })

    public product: any;

    @ApiProperty({
        enum: ["COURIER", "PICKUP"]
    })
    public orderType: OrderTypesEnum;
}
