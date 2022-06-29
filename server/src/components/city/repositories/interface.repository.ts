import { CityEntity } from "../entities/city.entity";

export abstract class ICityRepository {
    abstract getAll(searchString: string): Promise<Array<CityEntity>>;
		abstract getBuId(id: string): any;
}
