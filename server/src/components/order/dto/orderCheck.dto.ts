import { ApiProperty } from "@nestjs/swagger";
import { IsObject, isString } from "class-validator";

export class OrderCheckDto{
	
	organizationid:string

	@IsObject()
    address: {
        city: string;
        street: string;
        home: number;
        flat: number;
        intercom: number;
        entrance: number;
        floor: number;
				kladrid:string
    };
}