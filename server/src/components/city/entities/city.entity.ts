import { ApiProperty } from "@nestjs/swagger";

export class CityEntity {
    @ApiProperty()
    private readonly id: UniqueId;

    @ApiProperty()
    private readonly name: string;

		@ApiProperty()
		private readonly isHidden: boolean;

    constructor(id: UniqueId, name: string,isHidden:boolean) {
        this.id = id;
        this.name = name;
				this.isHidden = isHidden;
    }

    public get getId() {
        return this.id;
    }
    public get getName() {
        return this.name;
    }
}
