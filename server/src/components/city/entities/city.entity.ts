import { ApiProperty } from "@nestjs/swagger";

export class CityEntity {
    @ApiProperty()
    private readonly id: UniqueId;

    @ApiProperty()
    private readonly name: string;

		@ApiProperty()
		private readonly isHidden: boolean;

		@ApiProperty()
		private readonly countOrg: number;

    constructor(id: UniqueId, name: string,isHidden:boolean,countOrg:number) {
        this.id = id;
        this.name = name;
				this.isHidden = isHidden;
				this.countOrg = countOrg
    }

    public get getId() {
        return this.id;
    }
    public get getName() {
        return this.name;
    }
}
