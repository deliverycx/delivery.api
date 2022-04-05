import { CategoryEntity } from "../entities/category.entity";

export abstract class ICategoryRepository {
    abstract getAll: (
        organizationId: UniqueId
    ) => Promise<Array<CategoryEntity>>;
}
