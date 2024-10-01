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

	@ApiProperty()
	private readonly isHiddenOnMobile: boolean;

	constructor(id: UniqueId, name: string, isHidden: boolean, countOrg: number, isHiddenOnMobile: boolean) {
		this.id = id;
		this.name = name;
		this.isHidden = isHidden;
		this.countOrg = countOrg
		this.isHiddenOnMobile = isHiddenOnMobile
	}

	public get getId() {
		return this.id;
	}
	public get getName() {
		return this.name;
	}
}
