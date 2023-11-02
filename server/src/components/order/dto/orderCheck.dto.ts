import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsOptional, isString } from "class-validator";

export class OrderCheckDto{
	
	organizationid:string

	@IsObject()
	@IsOptional()
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