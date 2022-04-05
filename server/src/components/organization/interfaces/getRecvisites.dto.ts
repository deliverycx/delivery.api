import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class RecvisitesDTO {
    @ApiProperty()
    @IsMongoId()
    organizationId: UniqueId;
}
