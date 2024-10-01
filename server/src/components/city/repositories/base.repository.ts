import { BaseRepository } from "../../../common/abstracts/base.repository";
import { CityClass, CityModel } from "../../../database/models/city.model";
import { CityEntity } from "../entities/city.entity";
import { ICityRepository } from "./interface.repository";
import { cityMapper } from "../entities/city.mapper";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
export class CityRepository implements ICityRepository {
	constructor(
		@Inject("City")
		private readonly cityModel: Model<CityClass>
	) { }

	async getAll(searchString: string) {
		const result = await this.cityModel
			.find({
				name: {
					$regex: searchString,
					$options: "i"
				}
			})
			.populate("organizations")
			.lean();



		return cityMapper(result);
	}

	async getBuId(id: string) {
		const result = await this.cityModel
			.findById(id)
			.populate("organizations")
			.lean();

		return new CityEntity(result._id, result.name, result.isHidden, result.organizations.length, result.isHiddenOnMobile);
	}
}
