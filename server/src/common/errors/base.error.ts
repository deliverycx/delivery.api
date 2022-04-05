import { ApiProperty } from "@nestjs/swagger";

export class BaseError {
    @ApiProperty()
    private readonly error: any;

    @ApiProperty()
    private readonly status: number;

    constructor(error, status) {
        this.error = error;
        this.status = status;
    }

    public get getError() {
        return this.error;
    }

    public get getStatus() {
        return this.status;
    }
}
