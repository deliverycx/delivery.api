import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class GetByIdDTO {
    @ApiProperty()
    @IsMongoIdObject()
    public id: UniqueId;
}
