import { ApiProperty } from "@nestjs/swagger";
import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";

export class AddRemoveDTO {
    @ApiProperty()

    productId: string;
}
