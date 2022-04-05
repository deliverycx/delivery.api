import { ApiProperty } from "@nestjs/swagger";
import { iiko } from "src/services/iiko/interfaces";

export type FilterNoZeroBalanceType = () => Omit<
    IStopListEntity,
    "filterNoZeroBalance"
>;

export interface IStopListEntity {
    organization: UniqueId;
    stopList: Array<iiko.IStopListItem>;

    filterNoZeroBalance: FilterNoZeroBalanceType;
}

export class StopListEntity implements IStopListEntity {
    @ApiProperty({
        type: "string"
    })
    public readonly organization: UniqueId;

    @ApiProperty({
        type: "array",
        items: {
            type: "object",
            properties: {
                productId: { type: "string" },
                balance: { type: "number" }
            }
        }
    })
    public stopList: Array<iiko.IStopListItem>;

    constructor(organization: UniqueId, stopList: Array<iiko.IStopListItem>) {
        this.organization = organization;
        this.stopList = stopList;
    }

    public filterNoZeroBalance() {
        return {
            organization: this.organization,
            stopList: this.stopList.filter((el) => el.balance === 0)
        };
    }
}
