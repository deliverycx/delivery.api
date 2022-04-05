import { ApiProperty } from "@nestjs/swagger";

export class FavoriteEntity {
    @ApiProperty()
    private readonly product: UniqueId;

    @ApiProperty()
    private readonly isFav: boolean;

    constructor(productId, isFav) {
        this.product = productId;
        this.isFav = isFav;
    }

    public get getProduct() {
        return this.product;
    }

    public get fav() {
        return this.isFav;
    }
}
