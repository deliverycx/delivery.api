import { ApiProperty } from "@nestjs/swagger";

export class UserEntity {
    @ApiProperty()
    private readonly id: UniqueId;

    @ApiProperty()
    private readonly username: string;

    @ApiProperty({
        required: false
    })

		private readonly refreshToken:string

    private readonly name?: string;

		private readonly password?: string;

    @ApiProperty({
        required: false
    })
    private readonly phone?: string;

    @ApiProperty({
        required: false
    })
    private readonly address?: string;
    @ApiProperty({
        required: false
    })
    private readonly organization?: UniqueId;

    constructor(
        id: UniqueId,
        username: string,
				refreshToken:string,
        phone?: string,
				password?:string
    ) {
        this.id = id;
        this.username = username;
				this.refreshToken = refreshToken
        this.phone = phone;
				this.password = password
    }

    public check() {
        return !!this.id;
    }

		public get getToken() {
			return this.refreshToken;
	}
    public get getAddress() {
        return this.address;
    }
    public get getPhone() {
        return this.phone;
    }
    public get getName() {
        return this.name;
    }
    public get getUsername() {
        return this.username;
    }
    public get getId() {
        return this.id;
    }
    public get getOrganization() {
        return this.organization;
    }

		public get getPassword() {
			return this.password;
	}
}
