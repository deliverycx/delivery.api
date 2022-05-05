import { ApiProperty } from "@nestjs/swagger";

export class subscriptionDTO {
  @ApiProperty()
  public readonly to:string
}
export class subscriptionResponse{
  @ApiProperty()
  public readonly status:string
}
