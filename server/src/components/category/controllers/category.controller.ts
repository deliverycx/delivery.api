import {
    Controller,
    Get,
    Query,
    UseFilters,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { GetAllDTO } from "../interfaces/getAll.dto";
import { CategoryUsecase } from "../usecases/category.usecase";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { CategoryEntity } from "../entities/category.entity";
import { ValidationException } from "src/filters/validation.filter";

@ApiTags("Category endpoints")
@Controller("category")
@UseFilters(new ValidationException())
@UsePipes(
    new ValidationPipe({
        transform: true
    })
)
export class CategoryController {
    constructor(private readonly categoryUsecase: CategoryUsecase) {}

    @ApiResponse({
        status: 200,
        type: [CategoryEntity]
    })
    @Get("all")
    async getAll(@Query() query: GetAllDTO) {
        const result = await this.categoryUsecase.getAll(query.organizationId);

        return result;
    }
}
