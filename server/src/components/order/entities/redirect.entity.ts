import { ApiProperty } from "@nestjs/swagger";

export class RedirectEntity {
    @ApiProperty()
    private readonly redirectUrl: string;

    constructor(redirectUrl: string) {
        this.redirectUrl = redirectUrl;
    }

    get getRedirectUrl() {
        return this.redirectUrl;
    }
}
