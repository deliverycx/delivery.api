import { INestApplication } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Model, ObjectId } from "mongoose";
import { productsStub } from "./stubs/product.stub";
import { userStub } from "./stubs/user.stub";
import { ProductClass } from "src/database/models/product.model";
import { UserClass } from "src/database/models/user.model";
import { CartModule } from "src/ioc/cart.module";
import { ProductModule } from "src/ioc/product.module";
import * as request from "supertest";
import { UserModule } from "src/ioc/user.module";
import { OrderTypesEnum } from "src/services/iiko/iiko.abstract";
import {
    cartFirstUserStub,
    cartIds,
    cartSecondUserStub
} from "./stubs/cart.stub";
import { CartClass } from "src/database/models/cart.model";

describe("Cart Module", () => {
    let app: INestApplication;
    let mongo: MongoMemoryServer;
    let cartModel: Model<CartClass>;

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
                CartModule,
                ProductModule,
                UserModule
            ]
        }).compile();

        const productModel = moduleRef.get<Model<ProductClass>>("Product");
        const userModel = moduleRef.get<Model<UserClass>>("User");
        cartModel = moduleRef.get<Model<CartClass>>("Cart");

        await productModel.insertMany(productsStub);
        await userModel.insertMany([userStub]);
        await cartModel.insertMany([cartFirstUserStub, cartSecondUserStub]);

        app = moduleRef.createNestApplication();
        app.use((req, res, next) => {
            req.session = {
                user: userStub._id
            };
            next();
        });
        await app.init();
    });

    afterEach(async () => {
        await app.close();
        await mongo.stop();
    });

    describe("Cart Actions", () => {
        it("should add product to cart", (done) => {
            const sendData = {
                orderType: OrderTypesEnum.COURIER,
                productId: productsStub[0]._id
            };

            request(app.getHttpServer())
                .post("/cart/add")
                .send(sendData)
                .expect(200)
                .then((res) => {
                    expect(res.body.deliveryPrice).toBe(150);
                    expect(res.body.item.price).toBe(productsStub[0].price);
                    done();
                });
        });

        it("should remove one product from cart", (done) => {
            const sendData = {
                cartId: cartIds[0],
                orderType: OrderTypesEnum.COURIER
            };

            request(app.getHttpServer())
                .delete("/cart/removeOne")
                .send(sendData)
                .expect(200)
                .then((res) => {
                    expect(res.body.deletedId).toBeDefined();
                    done();
                });
        });

        it("should change amount of cart item", (done) => {
            const sendData = {
                orderType: OrderTypesEnum.COURIER,
                amount: 2,
                cartId: cartIds[0]
            };

            request(app.getHttpServer())
                .post("/cart/amount")
                .send(sendData)
                .expect(200)
                .then((res) => {
                    expect(res.body.item.amount).toBe(2);

                    done();
                });
        });

        describe("Test Order Type And Recived Data", () => {
            it("should return delivery price 150", (done) => {
                request(app.getHttpServer())
                    .get(`/cart/getAll?orderType=${OrderTypesEnum.COURIER}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body.deliveryPrice).toBe(150);
                        expect(res.body.cart.length).toBe(1);
                        done();
                    });
            });

            it("should return delivery price 0", (done) => {
                request(app.getHttpServer())
                    .get(`/cart/getAll?orderType=${OrderTypesEnum.PICKUP}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body.deliveryPrice).toBe(0);
                        expect(res.body.cart.length).toBe(1);
                        done();
                    });
            });
        });

        it("should clear cart", (done) => {
            request(app.getHttpServer())
                .delete("/cart/deleteAll")
                .expect(200)
                .then((res) => {
                    expect(res.body.length).toBe(0);
                    done();
                });
        });

        it("should return 200, but cart not change", (done) => {
            const sendData = {
                cartId: cartIds[1],
                orderType: OrderTypesEnum.COURIER
            };

            request(app.getHttpServer())
                .delete("/cart/removeOne")
                .send(sendData)
                .expect(200)
                .then(async () => {
                    const data = await cartModel.findById(cartIds[1]);
                    expect(data).not.toBeNull();
                    done();
                });
        });
    });
});
