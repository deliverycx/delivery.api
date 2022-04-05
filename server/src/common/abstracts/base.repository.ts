import { Model } from "mongoose";
import { Mapper } from "./mapper.interface";

export abstract class BaseRepository<ModelClass, ReturnValue> {
    constructor(
        private readonly model: Model<any>,

        private readonly mapper:
            | Mapper<ModelClass, ReturnValue>
            | Mapper<ModelClass, Promise<ReturnValue>>,

        private readonly field: string,

        private readonly populateField: string = ""
    ) {}

    async getAll(id?: UniqueId): Promise<ReturnValue> {
        const result = await (<any>this.model
            .find({
                [this.field]: id
            })
            .sort({ order: 1 })
            .populate(this.populateField));
        return this.mapper(result);
    }
}
