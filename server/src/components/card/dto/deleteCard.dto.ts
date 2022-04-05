import { ApiProperty } from "@nestjs/swagger";

export class DeleteCardDTO {
    @ApiProperty()
    cardId: UniqueId;
}
