import { ApiProperty } from "@nestjs/swagger";

export class CityEntity {
    @ApiProperty()
    private readonly id: UniqueId;

    @ApiProperty()
    private readonly name: string;

    constructor(id: UniqueId, name: string) {
        this.id = id;
        this.name = name;
    }

    public get getId() {
        return this.id;
    }
    public get getName() {
        return this.name;
    }
}
