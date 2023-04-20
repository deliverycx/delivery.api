import { iiko } from "src/services/iiko/interfaces";

import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { BaseRepository } from "src/common/abstracts/base.repository";
import { BaseError } from "src/common/errors/base.error";
import { StopListClass } from "src/database/models/stopList.model";
import { StopListEntity } from "../entities/stopList.entity";
import { stopListMapper } from "../entities/stopList.mapper";
import { IStopListRepository } from "./interface.repository";
import { ProductClass } from "src/database/models/product.model";

@Injectable()
export class StopListRepository implements IStopListRepository {
    constructor(
        @Inject("StopList")
        private readonly StopListModel: Model<StopListClass>,

        @Inject("Product")
        private readonly ProductModel: Model<ProductClass>
    ) {}

    async getAll(organizationId: UniqueId) {
        const { stoplist, organization } = await this.StopListModel.findOne({
            id: organizationId
        });

        return new StopListEntity(
            organization.toString(),
            await Promise.all(
                stoplist.map(async (el) => {
                    const productInStopList = await this.ProductModel.findOne({
                        id: el.product
                    });

                    return {
                        balance: el.balance,
                        productId: productInStopList._id.toString()
                    };
                })
            )
        );
    }

    async update(
        organization: UniqueId,
        stopListArray: Array<iiko.IStopListItem>
    ): Promise<void> {
        await this.StopListModel.updateOne(
            { organization },
            {
                $set: {
                    stoplist: stopListArray
                }
            },
            { upsert: true }
        );
    }
}
