import { CityClass } from "../../../database/models/city.model";
import { Mapper } from "../../../common/abstracts/mapper.interface";
import { StopListEntity } from "./stopList.entity";
import { OrganizationClass } from "../../../database/models/organization.model";
import { StopListClass } from "src/database/models/stopList.model";
import { async } from "rxjs";
import { ProductModel } from "src/database/models/product.model";

export const stopListMapper: Mapper<
    StopListClass,
    Promise<StopListEntity>
> = async (p) => {
    const stopList = p[0];

    return new StopListEntity(
        stopList.organization.toString(),
        await Promise.all(
            stopList.stoplist.map(async (el) => {
                const productInStopList = await ProductModel.findOne({
                    id: el.product
                });

                return {
                    balance: el.balance,
                    productId: productInStopList._id.toString()
                };
            })
        )
    );
};
