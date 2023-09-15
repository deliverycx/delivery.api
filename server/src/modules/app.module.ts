import { Inject, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { InternalException } from "src/filters/internal.filter";
import { CartModule } from "src/ioc/cart.module";
import { CityModule } from "src/ioc/city.module";
import { OrganizationModule } from "src/ioc/organization.module";
import { UserModule } from "src/ioc/user.module";

import { CategoryModule } from "../ioc/category.module";
import { ProductModule } from "../ioc/product.module";
import { OrderModule } from "src/ioc/order.module";
import { FavoriteModule } from "src/ioc/favorite.module";
import { BaseErrorsFilter } from "src/filters/base.filter";
import * as RedisStore from "connect-redis";
import * as session from "express-session";
import * as path from "path";
import { createClient, RedisClient } from "redis";
import { WebhookModule } from "src/ioc/webhook.module";
import { CardModule } from "src/ioc/card.module";
import { ErrorsInterceptor } from "src/interceptors/errors.interceptor";
import { LoggerModule } from "nestjs-pino";
import * as fs from "fs";
import { MongooseModule } from "@nestjs/mongoose";
import { RedisModule } from "./redis/redis.module";
import { REDIS } from "./redis/redis.constants";
import { StopListModule } from "src/ioc/stoplist.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

// КОСТЫЛЬ
try {
    fs.statSync(__dirname + "/../../pinologs");
} catch (e) {
    fs.mkdirSync(__dirname + "/../../pinologs");
}

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: path.resolve(
                __dirname,
                `../../.${process.env.NODE_ENV}.env`
            )
        }),
        MongooseModule.forRoot(process.env.CONNECTION, {
            connectionName: "DatabaseConnection"
        }),
				MongooseModule.forRoot(process.env.CONNECTION_ADMIN, {
					connectionName: "ADMINDatabaseConnection"
			}),
				
        RedisModule,
        LoggerModule.forRoot({
            pinoHttp: [
                {
                    name: "INFO LOGS",
                    level: "info",
                    autoLogging: true,
                    prettyPrint: true
                },
                fs.createWriteStream("./pinologs/info.log", {
                    encoding: "utf-8",
                    flags: "a"
                })
            ]
        }),
				ClientsModule.register([
					{
						name: 'COMMUNICATION',
						transport: Transport.TCP,
					},
					
				]),

        ProductModule,
        CategoryModule,
        CityModule,
        OrganizationModule,
        UserModule,
        CartModule,
        OrderModule,
        FavoriteModule,
        WebhookModule,
        CardModule,
				StopListModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorsInterceptor
        },
        {
            provide: APP_FILTER,
            useClass: InternalException
        },
        {
            provide: APP_FILTER,
            useClass: BaseErrorsFilter
        }
    ]
})
export class AppModule implements NestModule {
    constructor(@Inject(REDIS) private readonly redis: RedisClient) {}

    async configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    store: new (RedisStore(session))({
                        client: this.redis,
                        logErrors: true
                    }),
                    secret: process.env.SESSION_SECRET,
                    resave: true,

                    saveUninitialized: false,
                    cookie: {
                        sameSite: true,
                        httpOnly: true
                    }
                })
            )
            .forRoutes("*");
    }
}
