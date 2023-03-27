import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CityController } from "src/components/city/controllers/city.controller";
import { cityProviders } from "src/components/city/providers/city.provider";
import { CityRepository } from "src/components/city/repositories/base.repository";
import { ICityRepository } from "src/components/city/repositories/interface.repository";
import { CityUsecase } from "src/components/city/usecases/city.usecase";

@Module({

	imports: [
    ClientsModule.register([
      {
        name: 'COMMUNICATION',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_HOST}`],
          queue: 'cats_queue',
					noAck: false,
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
    controllers: [CityController],
    providers: [
        CityUsecase,
        {
            provide: ICityRepository,
            useClass: CityRepository
        },
        ...cityProviders
    ]
})
export class CityModule {}
