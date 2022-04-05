import * as request from "supertest";
import { Test } from "@nestjs/testing";
import * as session from "express-session";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { INestApplication } from "@nestjs/common";
import { UserModule } from "src/ioc/user.module";

describe("User Module", () => {
    let app: INestApplication;
    let mongoConnection: MongoMemoryServer;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongoConnection = await MongoMemoryServer.create();
                        const mongoUri = mongoConnection.getUri();

                        return {
                            uri: mongoUri
                        };
                    }
                }),
                UserModule
            ]
        }).compile();

        app = moduleRef.createNestApplication();
        app.use(
            session({
                secret: "test",
                saveUninitialized: false,
                resave: false
            })
        );
        await app.init();
    });

    describe("User creation test", () => {
        it("should return created user", (done) => {
            request(app.getHttpServer())
                .post("/user/create")
                .expect(200)
                .then((res) => {
                    expect(res.body).toHaveProperty("id");
                    expect(res.body).toHaveProperty("username");

                    done();
                });
        });
    });

    afterAll(async () => {
        await mongoConnection.stop();
        await app.close();
    });
});
