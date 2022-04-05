import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";

export class SearchQueryDTO {
    @ApiProperty()
    @IsMongoIdObject()
    public organizationId: UniqueId;

    @ApiProperty()
    @IsOptional()
    public searchString: string = "";
}
