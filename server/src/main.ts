import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { doc } from "./docs/api.doc";
import { NestExpressApplication } from "@nestjs/platform-express";
import { WorkerProccess } from "./services/worker.service";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
		app.use(cookieParser())

    const allowedRequestedFromHosts = process.env.CLIENT_PATH.split(" ");
		process.on('unhandledRejection', (reason, promise) => {})
    app.set("trust proxy", true);
		/*
    app.enableCors({
        origin: allowedRequestedFromHosts,

        credentials: true
    });
		*/
		app.enableCors({
			origin: true,
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
			credentials: true,
		});

    doc(app);

    await app.listen(process.env.PORT);
}
WorkerProccess.clusterizing(bootstrap);
