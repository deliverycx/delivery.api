import { ClientProxy } from "@nestjs/microservices";
import { ICityRepository } from "../repositories/interface.repository";
import { Inject, Injectable } from "@nestjs/common";
import { timeout } from "rxjs";

@Injectable()
export class CityUsecase {
    constructor(
			private readonly cityRepository: ICityRepository,
			@Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
		) {
			this.communicationClient.connect();
		}

    async getAll(searchString: string) {
        const result = await this.cityRepository.getAll(searchString);
			
        return result;
    }
		async getBuId(id: string) {
			const result = await this.cityRepository.getBuId(id);
		
			return result;
	}

	async getHello(){
		const q = this.communicationClient.emit(
      'user_created',
      'test microooo',
    )
		console.log(q);
	}

	async togetHello(){
		const result = this.communicationClient.send({ cmd: 'get_analytics' }, [1,2,3]).pipe(timeout(10000));
		
		return result
	}
}
