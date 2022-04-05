import { ApiProperty } from "@nestjs/swagger";

export class RecvisitesEntity {
    @ApiProperty()
    private readonly postcode: string;

    @ApiProperty()
    private readonly address: string;

    @ApiProperty()
    private readonly ogrn: string;

    @ApiProperty()
    private readonly inn: string;

    @ApiProperty()
    private readonly name: string;

    constructor(
        postcode: string,
        address: string,
        ogrn: string,
        inn: string,
        name: string
    ) {
        this.postcode = postcode;
        this.address = address;
        this.ogrn = ogrn;
        this.inn = inn;
        this.name = name;
    }
}
