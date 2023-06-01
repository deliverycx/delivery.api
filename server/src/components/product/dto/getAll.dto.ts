import { IsOptional } from "class-validator";
import { IsMongoIdObject } from "../../../common/decorators/mongoIdValidate.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllDTO {
		@IsOptional()
    @ApiProperty()
    @IsMongoIdObject()
    public categoryId?: UniqueId;

		@IsOptional()
		public organization:string
}
