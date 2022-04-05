import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class CategoryEntity {
    @ApiProperty()
    private readonly id: Types.ObjectId;

    @ApiProperty()
    private readonly name: string;

    @ApiProperty()
    private readonly image: ImagePath;

    constructor(id: Types.ObjectId, name: string, image: ImagePath) {
        this.id = id;
        this.name = name;
        this.image = image;
    }

    get getId() {
        return this.id;
    }

    get getName() {
        return this.name;
    }

    get getImage() {
        return this.image;
    }
}
