import { Controller, Get, Post, Query } from "@nestjs/common";
import { StopListUsecase } from "../usecases/stopList.usecase";

@Controller("stoplist")
export class StopListController {
	constructor(private readonly stopListUsecase: StopListUsecase) {}

	@Get("getStopList")
    async getAllById(
			@Query() query: {organizationId:string}
			) {

        const result = await this.stopListUsecase.getAll(query.organizationId);

        return result
    }
}