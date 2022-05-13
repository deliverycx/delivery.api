import { ApiProperty } from "@nestjs/swagger";
import { IsMongoIdObject } from "src/common/decorators/mongoIdValidate.decorator";

export class BotReverveTableDTO{
  @ApiProperty()
  public readonly organizationId: UniqueId
  
	
  public readonly fullname: string

  public readonly date: string
  
  public readonly preson: number
  
  public readonly time: string

  public readonly phone: string
}