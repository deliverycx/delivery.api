import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { ProductModule } from "src/ioc/product.module";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { INestApplication } from "@nestjs/common";
import * as mongoose from "mongoose";
import * as session from "express-session";
import { ProductEntity } from "../entities/product.entity";
import { ProductClass, ProductModel } from "src/database/models/product.model";
import { categoriesIds, productsStub } from "./stubs/product.stub";
import { CategoryModule } from "src/ioc/category.module";

describe("Product Module", () => {
    let app: INestApplication;
    let mongo: MongoMemoryServer;
    let productData: any[];

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongo = await MongoMemoryServer.create();

                        return {
                            uri: mongo.getUri()
                        };
                    },
                    connectionName: "DatabaseConnection"
                }),
                ProductModule,
                CategoryModule
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

        const productModel =
            moduleRef.get<mongoose.Model<ProductClass>>("Product");
        await productModel.insertMany(productsStub);
        productData = await productModel.find();
    });

    describe("product get", () => {
        it("should return one product", (done) => {
            request(app.getHttpServer())
                .get(`/product/${productData[0]._id}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toHaveProperty("name");
                    expect(res.body).toHaveProperty("price");

                    done();
                });
        });

        it("should return list of products", (done) => {
            request(app.getHttpServer())
                .get(
                    `/product/all?categoryId=${categoriesIds[0]._id.toString()}`
                )
                .expect(200)
                .then((res) => {
                    expect(res.body).toBeInstanceOf(Array);

                    done();
                });
        });
    });

    afterAll(async () => {
        await app.close();
        await mongo.stop();
        await mongoose.disconnect();
    });
});
