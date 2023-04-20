import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { doc } from "./docs/api.doc";
import { NestExpressApplication } from "@nestjs/platform-express";
import { WorkerProccess } from "./services/worker.service";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const allowedRequestedFromHosts = process.env.CLIENT_PATH.split(" ");

    
		/*
    app.enableCors({
        origin: allowedRequestedFromHosts,

        credentials: true
    });
		*/
		//app.enableCors();
		/*
		const options = {
			origin:'*',
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			preflightContinue: true,
			optionsSuccessStatus: 204,
			credentials: true,
		};
		app.enableCors(options);
		*/
		app.enableCors({
			origin: true,
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
			credentials: true,
		});
		
		app.set("trust proxy", true);

    doc(app);

    await app.listen(process.env.PORT);
}
WorkerProccess.clusterizing(bootstrap);
