import { BaseRepository } from "../../../common/abstracts/base.repository";
import { Model } from "mongoose";
import { CategoryClass } from "../../../database/models/category.model";
import { CategoryEntity } from "../entities/category.entity";
import { categoryMapper } from "../entities/category.mapper";
import { ICategoryRepository } from "./interface.repository";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CategoryRepository
    extends BaseRepository<Array<CategoryClass>, Array<CategoryEntity>>
    implements ICategoryRepository
{
    constructor(
        @Inject("Category")
        private readonly CategoryModel: Model<CategoryClass>
    ) {
        super(CategoryModel, categoryMapper, "organization");
    }
}
