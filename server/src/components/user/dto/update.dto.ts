import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class UpdateDTO {
    @ApiProperty({
        type: "string",
        required: false
    })
    @IsMongoId()
    organizationId?: UniqueId;

    @ApiProperty({
        type: "string",
        required: false
    })
    name?: UniqueId;

    @ApiProperty({
        type: "string",
        required: false
    })
    phone?: UniqueId;

    @ApiProperty({
        required: false,
        type: "object",
        properties: {
            home: { type: "number" },
            street: { type: "string" }
        }
    })
    address?: {
        home: number;
        street: string;
    };
}
