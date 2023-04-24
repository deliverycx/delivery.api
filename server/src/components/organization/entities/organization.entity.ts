import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";

export class OrganizationEntity {
    @ApiProperty()
    @IsMongoIdObject()
    private readonly id: Types.ObjectId;

    @ApiProperty()
    private readonly guid: UniqueId;

    @ApiProperty()
    private readonly address?: string;

    @ApiProperty()
    private readonly city?: string;

    @ApiProperty({
        type: "array",
        items: {
            multipleOf: 2,
            allOf: [{ type: "number" }, { type: "number" }]
        }
    })
    private readonly cords?: [number, number];

    @ApiProperty()
    private readonly phone?: string;

    @ApiProperty()
    private readonly workTime?: string | string[];

    @ApiProperty()
    private readonly cardPay?: boolean;
    
    @ApiProperty()
    private readonly delivMetod?: string | null;
    
    @ApiProperty()
    private readonly isHidden:boolean

		@ApiProperty()
		private readonly reservetable:boolean

		@ApiProperty()
		public readonly cityid:string

		@ApiProperty()
		public readonly redirect:string

		@ApiProperty()
		public readonly redirectON:boolean

    constructor(
        id: Types.ObjectId,
        address?: string,
        city?: string,
        cords?: [number, number],
        phone?: string,
        workTime?: string | string[],
        guid?: UniqueId,
        delivMetod?:string | null,
        isHidden?:boolean,
				reservetable?:boolean,
				cityid?:string,
				redirect?:string,
				redirectON?:boolean
    ) {
        this.id = id;
        this.address = address;
        this.city = city;
        this.cords = cords;
        this.phone = phone;
        this.workTime = workTime;
        this.guid = guid;
        this.delivMetod = delivMetod,
        this.isHidden = isHidden,
				this.reservetable = reservetable,
				this.cityid = cityid,
				this.redirect = redirect,
				this.redirectON = redirectON
    }

    public get getGuid() {
        return this.guid;
    }

    public get getId() {
        return this.id;
    }

    public get getAddress() {
        return this.address;
    }

    public get getCity() {
        return this.city;
    }

    public get getCords() {
        return this.cords;
    }

    public get getPhone() {
        return this.phone;
    }

    public get getWorkTime() {
        return this.workTime;
    }
}
