import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllDTO {
    @ApiProperty()
    @IsMongoIdObject()
    cityId: UniqueId;
}
