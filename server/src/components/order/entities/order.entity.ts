import { ApiProperty } from "@nestjs/swagger";
import { OrderDTO } from "../dto/order.dto";

export class OrderEntity {
    @ApiProperty({
        type: "string",
        example: "63256"
    })
    private readonly number: number | string;

    constructor(number: number | string) {
        this.number = number;
    }

    public get getNumber() {
        return this.number;
    }
}

export class OrderCreateEntity{
	public readonly user:string
	public readonly organization :string
	public readonly orderId?:string
	public readonly orderNumber?:number | null
	public readonly orderHash:string
	public readonly orderStatus?:string
	public readonly orderAmount?:number
	public readonly orderItems:any[]
	public readonly orderParams:OrderDTO
}