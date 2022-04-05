import { INestApplication } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { url } from "inspector";
import { override } from "joi";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Model } from "mongoose";
import { LoggerModule } from "nestjs-pino";
import { RedisClient } from "redis";
import { cartProviders } from "src/components/cart/providers/cart.provider";
import { organizationProviders } from "src/components/organization/providers/organization.provider";
import { productProviders } from "src/components/product/providers/product.provider";
import { userProviders } from "src/components/user/providers/user.provider";
import { CartClass } from "src/database/models/cart.model";
import { OrganizationClass } from "src/database/models/organization.model";
import { PaymentServiceDataClass } from "src/database/models/payment.model";
import { ProductClass } from "src/database/models/product.model";
import { UserClass } from "src/database/models/user.model";
import { BaseErrorsFilter } from "src/filters/base.filter";
import { OrderModule } from "src/ioc/order.module";
import { REDIS } from "src/modules/redis/redis.constants";
import { IBotService } from "src/services/duplicateBot/bot.abstract";
import { BotService } from "src/services/duplicateBot/bot.service";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";
import { IikoService } from "src/services/iiko/iiko.service";
import { PaymentMethods } from "src/services/payment/payment.abstract";
import { Paymaster } from "src/services/payment/sdk/common/paymaster";
import * as request from "supertest";
import { IOrderUtilsService } from "../services/order/interface.service";
import { OrderUsecase } from "../usecases/order.usecase";
import {
    cartStub,
    productsStub,
    userStub,
    organizationId,
    organizationStub,
    userId
} from "./stubs";
import { paymentInfoStub } from "./stubs/paymentInfo.stub";

const bot = {
    sendDuplicate: () => []
};

describe("Order Module", () => {
    let app: INestApplication;
    let mongo: MongoMemoryServer;
    let iikoService: IikoService;
    let orderUsecase: OrderUsecase;
    let redis: RedisClient;
    let paymaster: Paymaster;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongo = await MongoMemoryServer.create();

                        return {
                            uri: mongo.getUri()
                        };
                    }
                }),
                LoggerModule.forRoot({
                    pinoHttp: {
                        enabled: false
                    }
                }),
                OrderModule
            ],
            providers: [
                ...cartProviders,
                ...productProviders,
                ...userProviders,
                ...organizationProviders,
                {
                    provide: APP_FILTER,
                    useClass: BaseErrorsFilter
                }
            ]
        })
            .overrideProvider("BOT_AXIOS")
            .useValue(bot)
            .overrideProvider("IIKO_AXIOS")
            .useValue({
                token: () => 2,
                orderTypes: () => ({
                    items: [
                        {
                            id: "some",
                            name: "sone",
                            orderServiceType: "soke",
                            externalRevision: "sope"
                        }
                    ]
                }),
                orderCreate: () => ({}),
                checkOrder: () => ({
                    numState: 0,
                    message: "some error or not message"
                })
            })
            .compile();

        iikoService = moduleRef.get<IikoService>("IIiko");
        orderUsecase = moduleRef.get<OrderUsecase>(OrderUsecase);
        redis = moduleRef.get<RedisClient>(REDIS);
        paymaster = moduleRef.get<Paymaster>("Paymaster");

        const cartModel = moduleRef.get<Model<CartClass>>("Cart");
        const userModel = moduleRef.get<Model<UserClass>>("User");
        const productModel = moduleRef.get<Model<ProductClass>>("Product");
        const organizationModel = await moduleRef.get<Model<OrganizationClass>>(
            "Organization"
        );
        const organizationPaymentsInfo = await moduleRef.get<
            Model<PaymentServiceDataClass>
        >("PaymentServiceData");

        await cartModel.insertMany(cartStub);
        await userModel.insertMany(userStub);
        await productModel.insertMany(productsStub);
        await organizationModel.insertMany(organizationStub);
        await organizationPaymentsInfo.insertMany(paymentInfoStub);

        app = moduleRef.createNestApplication();
        app.use((req, res, next) => {
            req.session = {
                user: userId
            };

            next();
        });
        await app.init();
    });

    afterEach(async () => {
        await app.close();
        await mongo.stop();
    });

    afterAll(async () => {
        await new Promise((resolve, reject) => {
            redis.quit(() => {
                resolve(1);
            });
        });

        await new Promise((resolve) => setImmediate(resolve));
    });

    describe("Order Tests", () => {
        it("should return /success/* uri", (done) => {
            jest.spyOn<any, "create">(iikoService, "create").mockImplementation(
                () => 777
            );
            // console.log(botService);
            // jest.spyOn<any, "sendDuplicate">(
            //     botService,
            //     "sendDuplicate"
            // ).mockImplementation(() => 777);

            const sendData = {
                organization: organizationId,
                name: "TestOrderUser",
                address: {
                    city: "Симферополь",
                    street: "улица Турецкая",
                    home: 15
                },
                phone: "+79786517145",
                paymentMethod: PaymentMethods.CASH,
                comment: "This is a test order from test env",
                email: "test@tt.com"
            };

            request(app.getHttpServer())
                .post("/order/create")
                .send(sendData)
                .expect(200)
                .then((res) => {
                    expect(res.body.redirectUrl).toMatch(/^\/success\/.*$/i);

                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });

        it("should return validation error", (done) => {
            jest.spyOn(orderUsecase, "checkOrder");

            const sendData = {
                organization: organizationId,
                name: "TestOrderUser",
                address: {
                    city: "Симферополь",
                    street: "улица Турецкая",
                    home: 15
                },
                phone: "+79786517145",
                paymentMethod: PaymentMethods.CASH,
                orderType: OrderTypesEnum.COURIER,
                comment: "This is a test order from test env",
                email: "test@tt.com"
            };

            request(app.getHttpServer())
                .post("/order/check")
                .send(sendData)
                .expect(422)
                .then((res) => {
                    expect(orderUsecase.checkOrder).not.toHaveBeenCalled();
                    done();
                });
        });

        it("should return Paymaster url with cpl", (done) => {
            jest.spyOn<any, "paymentUrl">(
                paymaster,
                "paymentUrl"
            ).mockImplementation(() => ({
                paymentId: "111111",
                url: "https://paymaster/payments/hashfrompaymaster"
            }));

            const sendData = {
                organization: organizationId,
                name: "TestOrderUser",
                address: {
                    city: "Симферополь",
                    street: "улица Турецкая",
                    home: 15
                },
                phone: "+79786517145",
                paymentMethod: PaymentMethods.CARD,
                comment: "This is a test order from test env",
                email: "test@tt.com"
            };

            request(app.getHttpServer())
                .post("/order/create")
                .send(sendData)
                .expect(200)
                .then((res) => {
                    expect(res.body.redirectUrl).toMatch(/cpay\/.*$/i);

                    done();
                });
        });
    });
});
