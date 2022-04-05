import { IsMongoIdObject } from "../../../common/decorators/mongoIdValidate.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllDTO {
    @ApiProperty()
    @IsMongoIdObject()
    public categoryId: UniqueId;
}
