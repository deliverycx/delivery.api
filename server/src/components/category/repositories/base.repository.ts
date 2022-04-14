import { BaseRepository } from "../../../common/abstracts/base.repository";
import { Model } from "mongoose";
import { CategoryClass } from "../../../database/models/category.model";
import { CategoryEntity } from "../entities/category.entity";
import { categoryMapper } from "../entities/category.mapper";
import { ICategoryRepository } from "./interface.repository";
import { Inject, Injectable } from "@nestjs/common";
import { OrganizationClass } from "src/database/models/organization.model";

@Injectable()
export class CategoryRepository
    extends BaseRepository<Array<CategoryClass>, Array<CategoryEntity>>
    implements ICategoryRepository
{
    constructor(
        @Inject("Category")
        private readonly CategoryModel: Model<CategoryClass>,
        @Inject("Organization")
        private readonly OrganizationModel: Model<OrganizationClass>
    ) {
        super(CategoryModel, categoryMapper, "organization");
    }
    async getAllById(idorg: string) {
        
        const org = await this.OrganizationModel.findOne({ id: idorg })
        const result = await this.CategoryModel.find({organization: org._id })
        
        return categoryMapper(result)
    }
}
