import s from "connect-redis";
import { StopListEntity } from "../entities/stopList.entity";
import { iiko } from "src/services/iiko/interfaces";

export abstract class IStopListRepository {
    abstract update(
        organization: UniqueId,
        stopListArray: Array<iiko.IStopListItem>
    ): Promise<void>;

    abstract getAll(organization: string): Promise<any>;
}
