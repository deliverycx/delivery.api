import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class UpdateDTO {
  id:string  
	username:string
	phone:string
	code?:string
}
