import { ApiProperty } from "@nestjs/swagger";

export class BotReverveTableDTO{
  @ApiProperty()
  public readonly organizationId: UniqueId
  
  public readonly fullname: string

  public readonly date: string
  
  public readonly preson: number
  
  public readonly time: string

  public readonly phone: string
}