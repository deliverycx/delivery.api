import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllDTO {
    @ApiProperty({
        type: String
    })
    @IsMongoIdObject()
    organizationId: UniqueId;
}
