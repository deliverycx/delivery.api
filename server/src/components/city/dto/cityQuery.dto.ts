import { ApiProperty } from "@nestjs/swagger";

export class CityQueryDTO {
    @ApiProperty({
        example: "симф",
        required: false
    })
    public readonly search?: string;
}
