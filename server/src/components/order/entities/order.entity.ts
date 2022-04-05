import { ApiProperty } from "@nestjs/swagger";

export class OrderEntity {
    @ApiProperty({
        type: "string",
        example: "63256"
    })
    private readonly number: number | string;

    constructor(number: number | string) {
        this.number = number;
    }

    public get getNumber() {
        return this.number;
    }
}
