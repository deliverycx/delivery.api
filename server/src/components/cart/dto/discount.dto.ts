import { ApiProperty } from "@nestjs/swagger";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";

export class DiscountDTO {
	@ApiProperty()
	organization: UniqueId;

	@ApiProperty({
		enum: ["COURIER", "PICKUP"]
	})
	public orderType: OrderTypesEnum;
}